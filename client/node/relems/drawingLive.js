exports.class = { 
    drawingRequestId    : -1,
    imageRequestId      : -1,
    type                : 'DrawingLive',
    drawIndex           : 0,
    nbIterations        : 500,
    drawTarget          : 0,
    drawDuration        : 10,
    isReady             : false,
    finished            : false,
    init                : false,
    opaque              : true,
    cache               : null,
    cacheAsImage        : null,
    strokes             : [],
    s: function (n,what)
    {
        return n*this.scaleRatio + (what == 'x' ? this.offsetX+this.left : this.offsetY+this.top);
    },
    drawZone: function (ctx,x,y,width,height)
    {

        ctx.save();

        ctx.beginPath();
        ctx.rect(x,y,width,height);
        
        ctx.clip();
        
        var t = (new Date()).getTime()-this.startTime.getTime()-4000;
        if ( this.cache != null ){
            ctx.putImageData(this.cache, this.left, this.top, x, y, width + this.left, height + this.top);
        }
        ctx.restore();

    },
    draw: function(ctx)
    {
        for(var i = this.strokes.length-1; i >= 0; i--){
            var stroke = this.strokes[i].stroke;
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = stroke.color;
            ctx.lineWidth = stroke.lineWidth;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            var tStart = this.strokes[i].dateLast.getTime() - this.strokes[i].dateStart.getTime();
            var tNow = new Date().getTime() - this.strokes[i].dateStart.getTime();
            var dt = tNow - tStart;
            var iStart = Math.floor(tStart/1000.0/stroke.duration * stroke.points.length) - 1;
            var iEnd = Math.ceil(tNow/1000.0/stroke.duration * stroke.points.length);
            
            console.log(iEnd-iStart);
            
            if ( iStart < 0 )
                iStart = 0;
            
            ctx.moveTo(
                this.s(stroke.points[iStart].x), 
                this.s(stroke.points[iStart].y)
            );
            for(var j = iStart; j < iEnd && j < stroke.points.length; j++){
                ctx.lineTo(
                    this.s(stroke.points[j].x,"x"), 
                    this.s(stroke.points[j].y,"y")
                );
            }
            ctx.stroke();
            ctx.restore();
            this.strokes[i].dateLast = new Date();
            if(iEnd > stroke.points.length-1)
                this.strokes.splice(i,1);
        }
        this.needRedraw = true;
    },
    onDataStream: function(data){
        console.log("[DrawingLive] Got something...");
        if ( data.type == "stroke" ){
            console.log("[DrawingLive] Got stroke");
            this.strokes.push({dateStart: new Date(), dateLast: new Date(), stroke: data.stroke});
        }
    },
    load:function(callback)
    {
        serverStreamer.register(this, this.onDataStream.bind(this));
        
        var width = 1024;
        var height = 768;
        
        var imgFormat       = width/height;
        var drawFormat      = this.width/this.height;

        if(imgFormat > drawFormat) // The image is more landscape
        {
            this.offsetX            = 0;
            this.scaleRatio         = this.width/width;
            this.offsetY            = (this.height-height*this.scaleRatio)/2;
        }
        else // The image is more portrait
        {
            this.offsetY            = 0;
            this.scaleRatio         = this.height/height;
            this.offsetX            = (this.width-width*this.scaleRatio)/2;
        }
        this.isReady = true;
        callback();
    },
    cleanup:function()
    {
        serverStreamer.unregister(this);
    }
};