var drawingTime = 10; // in seconds
var drawInterval = 15; // in milliseconds

var Drawing = rElem.extend({
    isReady:false,
    type:'Drawing',
    timeout: 3000,
    drawSteps: 0,
    load:function(callback){
        this.createDom();
        this.timeout = this.data.timeout;
        this.interval = null;
        // this.interval = setInterval(this.draw.bind(this, callback), this.data.timeout*1000);
        this.strokeAt = 0;
        this.pointAt = 0;
        this.draw.call(this, callback);
    },
    draw: function (callback){
        var url = "";
        if ( this.data.id != undefined )
            url = '/drawing/?id=' + this.data.id;
        else
            url = '/drawing/?type=' + this.data.type + '&rand'+Math.floor(Math.random()*10000)
        $.get(url,{},function (drawing){
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
                    x:0,
                    y:0,
                    width: 2000,
                    height: 2000
                });
            }else if ( this.drawing.backgroundImage ){
                this.canvas.css({
                    backgroundImage:'url(' + this.drawing.backgroundImage + ')',
                    backgroundSize: 'cover',
                    backgroundPosition: '50% 50%'
                });
            }
            if ( !this.data.light ){
                this.doPeriodicInterval = setInterval(this.doPeriodicDraw.bind(this), drawInterval);
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
    doPeriodicDraw: function (){
        for (var pointsDrawn = 0; pointsDrawn < this.drawSteps; pointsDrawn++) {
            this.canvas.drawLine({
                rounded: true,
                strokeStyle: this.drawing.strokes[this.strokeAt].color,
                strokeWidth: this.drawing.strokes[this.strokeAt].lineWidth * this.scaleRatio,
                x1: this.drawing.strokes[this.strokeAt].points[this.pointAt].x * this.scaleRatio + this.offsetX,
                y1: this.drawing.strokes[this.strokeAt].points[this.pointAt].y * this.scaleRatio + this.offsetY,
                x2: this.drawing.strokes[this.strokeAt].points[this.pointAt + 1].x * this.scaleRatio + this.offsetX,
                y2: this.drawing.strokes[this.strokeAt].points[this.pointAt + 1].y * this.scaleRatio + this.offsetY
            });
            this.pointAt++;
            if (this.pointAt >= this.drawing.strokes[this.strokeAt].points.length - 1) {
                this.pointAt = 0;
                this.strokeAt++;
                if (this.strokeAt >= this.drawing.strokes.length) {
                    this.finished = true;
                    break;
                }
            }
        }
        if (this.finished) {
            clearInterval(this.doPeriodicInterval);
        }


        // for(i = this.drawAt; i < this.drawAt+1 && i < this.drawing.strokes.length; i++ ){
        //     for(j = 0; j < this.drawing.strokes[i].points.length-1; j++ ){
        //         this.canvas.drawLine({
        //             strokeStyle:this.drawing.strokes[i].color,
        //             strokeWidth:this.drawing.strokes[i].lineWidth*this.scaleRatio,
        //             x1: this.drawing.strokes[i].points[j].x*this.scaleRatio+this.offsetX, 
        //             y1: this.drawing.strokes[i].points[j].y*this.scaleRatio+this.offsetY,
        //             x2: this.drawing.strokes[i].points[j+1].x*this.scaleRatio+this.offsetX,
        //             y2: this.drawing.strokes[i].points[j+1].y*this.scaleRatio+this.offsetY,
        //             rounded:true
        //         });
        //     }
        // }
        // this.drawAt += 1;
    },
    cleanup: function (){
        $(this.viewPort).remove();
        clearInterval(this.interval);
        clearInterval(this.doPeriodicInterval);
    }
});
