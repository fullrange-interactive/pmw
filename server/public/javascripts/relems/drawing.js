var drawingTime = 60; // in seconds
var drawInterval = 30; // in milliseconds
var drawTimeout = 1000; // Time before starting the drawing

var Drawing = rElem.extend({
    isReady:false,
    type:'Drawing',
    timeout: 3000,
    drawSteps: 0,
    load:function(callback) {
        this.createDom();
        this.timeout = this.data.timeout;
        this.interval = null;
        // this.interval = setInterval(this.draw.bind(this, callback), this.data.timeout*1000);
        this.strokeAt = 0;
        this.pointAt = 0;
        this.draw.call(this, callback);
    },
    draw: function (callback) {
        if (window.IS_IN_ADMIN) {
            if (this.data.id != undefined)
                this.viewPort.html(this.data.id);
            else
                this.viewPort.html(this.data.type);
            this.viewPort.css({
                color: '#fff',
                fontSize: '8px'
            })
            return;
        }
        var url = "";
        if ( this.data.id != undefined )
            url = '/drawing/?id=' + this.data.id;
        else
            url = '/drawing/?type=' + this.data.type + '&rand'+Math.floor(Math.random()*10000)
        $.get(url, {}, function (drawing){
            if (drawing.backgroundImage) {
                var loader = new Image();
                loader.src = drawing.backgroundImage;
                loader.onload = callback;
                loader.onerror = callback;
            } else {
                callback();
            }
            this.drawSteps = ((drawing.points / drawingTime) / 1000) * drawInterval;
            if (this.drawSteps < 3)
                this.drawSteps = 3;
            this.drawSteps = Math.ceil(this.drawSteps);

            this.drawing = drawing;
            this.drawAt = 0;
            $(this.viewPort).empty();
            this.canvas = $("<canvas></canvas>");
            this.canvas[0].width = $(this.viewPort).width();
            this.canvas[0].height = $(this.viewPort).height();

            var imgFormat       = drawing.width/drawing.height;
            var drawFormat      = $(this.viewPort).width()/$(this.viewPort).height();
            if(imgFormat > drawFormat) // The image is more landscape
            {
                this.offsetX            = 0;
                this.scaleRatio         = $(this.viewPort).width()/drawing.width;
                this.offsetY            = ($(this.viewPort).height()-drawing.height*this.scaleRatio)/2;
            }
            else // The image is more portrait
            {
                this.offsetY        = 0;
                this.scaleRatio     = $(this.viewPort).height()/drawing.height;
                this.offsetX        = ($(this.viewPort).width()-drawing.width*this.scaleRatio)/2;
            }
            
            if ( this.drawAt == 0 )
                this.canvas.clearCanvas();
            if ( this.drawing.backgroundColor && this.drawAt == 0 ){
                this.canvas.drawRect({
                    fillStyle:drawing.backgroundColor,
                    x: 0,
                    y: 0,
                    fromCenter: false,
                    width: $(this.viewPort).width(),
                    height: $(this.viewPort).height()
                });
            }else if ( this.drawing.backgroundImage ){
                this.canvas.css({
                    backgroundImage:"url('" + this.drawing.backgroundImage + "')",
                    backgroundSize: 'cover',
                    backgroundPosition: '50% 50%',
                    backgroundRepeat: 'no-repeat'
                });
            }
            if ( !this.data.light ){
                this.startTimeout = setTimeout(function (){
                    this.doPeriodicInterval = setInterval(this.doPeriodicDraw.bind(this), drawInterval);
                }.bind(this), drawTimeout);
                $(this.viewPort).append(this.canvas);
            }else{
                for(i = 0; i < this.drawing.strokes.length; i++ ){
                    for(j = 0; j < this.drawing.strokes[i].points.length-1; j++ ){
                        this.canvas.drawLine({
                            strokeStyle:this.drawing.strokes[i].color,
                            strokeWidth:this.drawing.strokes[i].lineWidth*this.scaleRatio,
                            x1: this.drawing.strokes[i].points[j].x*this.scaleRatio+this.offsetX, 
                            y1: this.drawing.strokes[i].points[j].y*this.scaleRatio+this.offsetY,
                            x2: this.drawing.strokes[i].points[j+1].x*this.scaleRatio+this.offsetX,
                            y2: this.drawing.strokes[i].points[j+1].y*this.scaleRatio+this.offsetY,
                            rounded:true
                        });
                    }
                }
                $(this.viewPort).append(this.canvas);
            }
        }.bind(this),'json');
    },
    doPeriodicDraw: function () {
        if (this.finished)
            return;

        var rx = this.canvas.width();
        var ry = this.canvas.height();

        for (var pointsDrawn = 0; pointsDrawn < this.drawSteps; pointsDrawn++) {
            var x1 = this.drawing.strokes[this.strokeAt].points[this.pointAt].x * rx + this.offsetX;
            var y1 = this.drawing.strokes[this.strokeAt].points[this.pointAt].y * ry + this.offsetY;
            if (this.drawing.strokes[this.strokeAt].points.length === 1) {
                var x2 = x1 + 1;
                var y2 = y1 + 1;
            } else {
                var x2 = this.drawing.strokes[this.strokeAt].points[this.pointAt + 1].x * rx + this.offsetX;
                var y2 = this.drawing.strokes[this.strokeAt].points[this.pointAt + 1].y * ry + this.offsetY;
            }
            this.canvas.drawLine({
                rounded: true,
                strokeStyle: this.drawing.strokes[this.strokeAt].color,
                strokeWidth: this.drawing.strokes[this.strokeAt].lineWidth * this.scaleRatio * rx,
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2
            });

            this.pointAt++;
            if (this.pointAt >= this.drawing.strokes[this.strokeAt].points.length - 2) {
                this.pointAt = 0;
                this.strokeAt++;
                if (this.strokeAt >= this.drawing.strokes.length) {
                    this.finished = true;
                    break;
                }
            }
        }
        if (this.finished) {
            this.finishDraw();
        }
    },
    finishDraw: function () {
        if (!window.IS_IN_ADMIN) {
            $.get(
                '/drawing?id=' + this.drawing._id + '&sentOnce=1',
                {},
                function (data) {
                    console.log("Confirmation sent OK")
                })
        }
        clearInterval(this.doPeriodicInterval);
    },
    cleanup: function () {
        $(this.viewPort).remove();
        clearTimeout(this.startTimeout);
        clearInterval(this.interval);
        clearInterval(this.doPeriodicInterval);
    }
});
