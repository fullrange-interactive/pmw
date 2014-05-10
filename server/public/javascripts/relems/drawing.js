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
        }, this.data.timeout*1000);
        this.drawAt = 0;
        this.draw(that,callback);
    },
    draw: function (that,callback){
        //console.log("draw");
        var that = that;
        var url = "";
        if ( that.data.id != undefined )
            url = '/drawing/?id='+that.data.id;
        else
            url = '/drawing/?type=' + that.data.type + '&rand'+Math.floor(Math.random()*10000)
        $.get(url,{},function (drawing){
            that.drawing = drawing;
            that.drawAt = 0;
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
            
            if ( that.drawAt == 0 )
                that.canvas.clearCanvas();
            if ( that.drawing.backgroundColor != null && that.drawAt == 0 ){
                that.canvas.drawRect({
                    fillStyle:drawing.backgroundColor,
                    x:0,
                    y:0,
                    width: 2000,
                    height: 2000
                });
            }
			if ( !that.data.light ){
	            that.doPeriodicInterval = setInterval(function (){
	                that.doPeriodicDraw(that);
	            },10);
				$(that.viewPort).append(that.canvas);
			}else{
		        for(i = 0; i < that.drawing.strokes.length; i++ ){
		            for(j = 0; j < that.drawing.strokes[i].points.length-1; j++ ){
		                that.canvas.drawLine({
							strokeStyle:that.drawing.strokes[i].color,
							strokeWidth:that.drawing.strokes[i].lineWidth*that.scaleRatio,
							x1: that.drawing.strokes[i].points[j].x*that.scaleRatio+that.offsetX, 
							y1: that.drawing.strokes[i].points[j].y*that.scaleRatio+that.offsetY,
							x2: that.drawing.strokes[i].points[j+1].x*that.scaleRatio+that.offsetX,
							y2: that.drawing.strokes[i].points[j+1].y*that.scaleRatio+that.offsetY,
							rounded:true
						});
		            }
		        }
				$(that.viewPort).append(that.canvas);
			}
        },'json');
    },
    doPeriodicDraw: function (that){
        for(i = that.drawAt; i < that.drawAt+1 && i < that.drawing.strokes.length; i++ ){
            for(j = 0; j < that.drawing.strokes[i].points.length-1; j++ ){
                that.canvas.drawLine({
					strokeStyle:that.drawing.strokes[i].color,
					strokeWidth:that.drawing.strokes[i].lineWidth*that.scaleRatio,
					x1: that.drawing.strokes[i].points[j].x*that.scaleRatio+that.offsetX, 
					y1: that.drawing.strokes[i].points[j].y*that.scaleRatio+that.offsetY,
					x2: that.drawing.strokes[i].points[j+1].x*that.scaleRatio+that.offsetX,
					y2: that.drawing.strokes[i].points[j+1].y*that.scaleRatio+that.offsetY,
					rounded:true
				});
            }
        }
        that.drawAt += 1;
    },
    cleanup: function (){
		$(this.viewPort).remove();
        clearInterval(this.interval);
    }
});
