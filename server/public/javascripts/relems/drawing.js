var Drawing = rElem.extend({
    isReady:false,
    type:'Drawing',
    timeout: 30,
    load:function(callback){
        this.createDom();
        var that = this;
        this.timeout = this.data.timeout;
        this.interval = setInterval(function (){
            that.draw(that,callback);
        }, this.timeout*1000);
        this.draw(that,callback);
    },
    draw: function (that,callback){
        console.log("draw");
        var that = that;
        $.get('/drawing/?rand'+Math.floor(Math.random()*10000),{},function (drawing){
            $(that.viewPort).empty();
            that.canvas = $("<canvas></canvas>");
            that.canvas[0].width = $(that.viewPort).width();
            that.canvas[0].height = $(that.viewPort).height();

            var imgFormat       = drawing.width/drawing.height;
            var drawFormat      = $(that.viewPort).width()/$(that.viewPort).height();
            if(imgFormat > drawFormat) // The image is more landscape
            {
                that.offsetX            = 0;
                that.scaleRatio         = $(that.viewPort).width()/drawing.width;
                that.offsetY            = ($(that.viewPort).height()-drawing.height*that.scaleRatio)/2;
            }
            else // The image is more portrait
            {
                that.offsetY         = 0;
                that.scaleRatio          = $(that.viewPort).height()/drawing.height;
                that.offsetX        = ($(that.viewPort).width()-drawing.width*that.scaleRatio)/2;
            }

            that.canvas.clearCanvas();
            if ( drawing.backgroundColor != null ){
                that.canvas.drawRect({
                    fillStyle:drawing.backgroundColor,
                    x:0,
                    y:0,
                    width: 2000,
                    height: 2000
                });
            }
            for(i = 0; i < drawing.strokes.length; i++ ){
                for(j = 0; j < drawing.strokes[i].points.length-1; j++ ){
                    that.canvas.drawLine({
						strokeStyle:drawing.strokes[i].color,
						strokeWidth:drawing.strokes[i].lineWidth*that.scaleRatio,
						x1: drawing.strokes[i].points[j].x*that.scaleRatio+that.offsetX, 
						y1: drawing.strokes[i].points[j].y*that.scaleRatio+that.offsetY,
						x2: drawing.strokes[i].points[j+1].x*that.scaleRatio+that.offsetX,
						y2: drawing.strokes[i].points[j+1].y*that.scaleRatio+that.offsetY,
						rounded:true
					});
                }
            }
            $(that.viewPort).append(that.canvas);
        },'json');
        callback();
    },
    cleanup: function (){
        clearInterval(this.interval);
    }
});
