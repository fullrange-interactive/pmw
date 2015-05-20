exports.class = { 
    drawingRequestId    : -1,
    imageRequestId      : -1,
    type                : 'Drawing',
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
            //console.error(this.cache);
            ctx.putImageData(this.cache, this.left, this.top, x, y, width + this.left, height + this.top);
        }
        ctx.restore();

    },
    draw: function(ctx)
    {
        var t = (new Date()).getTime()-this.startTime.getTime()-4000;
        this.needRedraw = true;

        if ( this.cache != null ){
            //console.error(this.cache);
            ctx.drawImage(this.cacheAsImage, this.left, this.top);
            //ctx.putImageData(this.cache, this.left, this.top, 0, 0, this.width, this.height);
            return;
        }

        if(this.isReady && !this.finished && !this.aborted)
        {
            this.beginCanvasMask(ctx);

            var x = this.left;
            var y = this.top;
            var width = this.width;
            var height = this.height;

            if(!this.init && (this.data.currentDrawing.backgroundColor || this.data.currentDrawing.backgroundImage) || mainGrid.crossfading )
            {
                if ( this.data.currentDrawing.backgroundImage != null ){
                    console.log("drawing image");
                    console.log(this.top + " " + this.scaleRatioY + " " + this.ctxClipTop);
                    console.log("--")
                    ctx.drawImage(
                        this.imageObj,
                        Math.round((x-this.ctxClipLeft)*this.scaleRatioX+this.imgClipLeft),
                        Math.round((y-this.ctxClipTop)*this.scaleRatioY+this.imgClipTop),
                        Math.round(width*this.scaleRatioX),
                        Math.round(height*this.scaleRatioY),
                        x,
                        y,
                        width,
                        height
                    ); 
                    if(!mainGrid.crossfading)
                        this.init = true;
                }else{
                    console.log("drawing background")
                    ctx.fillStyle=this.data.currentDrawing.backgroundColor;
                    ctx.fillRect(this.left,this.top,this.width,this.height);

                    if(!mainGrid.crossfading)
                        this.init = true;
                }
            }

            var drawSpeed = this.drawSize/this.drawDuration;
            if ( drawSpeed < 50 ) drawSpeed = 50;
            this.drawTarget = Math.floor(t*drawSpeed/1000)
            var unfinished = false;
            
            if(this.drawSize == 0)
            {
                MediaServer.requestMedia('http://'+configOptions.contentServerIp+':'+configOptions.contentServerPort+'/drawing?id='+this.data.currentDrawing._id+'&sentOnce=1',"data",function(data){},function(error,code){});
                this.finished        = true;

            }
            else if(!mainGrid.crossfading && t > 0 && this.drawTarget - this.drawIndex > 2)
            {
                for(var i=this.drawIndex;i<this.drawTarget && !this.finished;i++)
                {
                    //console.log("[drawing] i = " + i + " drawindex = " + this.drawIndex + " drawTarget = " + this.drawTarget);
                    // If new line 
                    if(this.dIndex.point == this.data.currentDrawing.strokes[this.dIndex.line].points.length)
                    {      
                        //console.log("New line");

                        ctx.lineCap = 'round';ctx.lineJoin = 'round';
                        ctx.stroke();

                        this.dIndex.line++;
                        this.dIndex.point = 0;

                        if(this.dIndex.line == this.data.currentDrawing.strokes.length)
                        {
                            //console.log("End.");
                            MediaServer.requestMedia('http://'+configOptions.contentServerIp+':'+configOptions.contentServerPort+'/drawing?id='+this.data.currentDrawing._id+'&sentOnce=1',"data",function(data){},function(error,code){});
                            this.finished        = true;
                            this.needRedraw      = false;
                            console.log("---" + mainGrid.wrapper.width + " " + mainGrid.wrapper.height)
                            this.cache = ctx.getImageData(this.left,this.top,Math.round(mainGrid.wrapper.width),Math.round(mainGrid.wrapper.height));
                            this.cacheAsImage = new Canvas.Image();
                            this.cacheAsImage.src = Canvas.Image.saveToBuffer(this.cache);
                            break;
                        }

                        ctx.strokeStyle=this.data.currentDrawing.strokes[this.dIndex.line].color;
                        ctx.lineWidth=parseInt(this.data.currentDrawing.strokes[this.dIndex.line].lineWidth*this.scaleRatio);

                        ctx.beginPath();                        
                        ctx.moveTo(this.s(this.data.currentDrawing.strokes[this.dIndex.line].points[this.dIndex.point].x,'x'),
                        this.s(this.data.currentDrawing.strokes[this.dIndex.line].points[this.dIndex.point].y,'y'));

                    }
                    // If beginning
                    else if(i == this.drawIndex)
                    {
                        //console.log("Begin Iteration");

                        ctx.strokeStyle=this.data.currentDrawing.strokes[this.dIndex.line].color;
                        ctx.lineWidth=parseInt(this.data.currentDrawing.strokes[this.dIndex.line].lineWidth*this.scaleRatio);

                        ctx.beginPath();  

                        if(this.dIndex.point != 0)
                        {
                            ctx.moveTo(this.s(this.data.currentDrawing.strokes[this.dIndex.line].points[this.dIndex.point-1].x,'x'),
                            this.s(this.data.currentDrawing.strokes[this.dIndex.line].points[this.dIndex.point-1].y,'y'));
                            ctx.lineTo(this.s(this.data.currentDrawing.strokes[this.dIndex.line].points[this.dIndex.point].x,'x'),
                            this.s(this.data.currentDrawing.strokes[this.dIndex.line].points[this.dIndex.point].y,'y'));
                        }
                        else
                        {


                            ctx.moveTo(this.s(this.data.currentDrawing.strokes[this.dIndex.line].points[this.dIndex.point].x,'x'),
                            this.s(this.data.currentDrawing.strokes[this.dIndex.line].points[this.dIndex.point].y,'y'));
                        }
                    }
                    // last point
                    else if(i == this.drawTarget - 1) // Last point
                    {
                        //console.log("End Iteration");

                        ctx.lineTo(this.s(this.data.currentDrawing.strokes[this.dIndex.line].points[this.dIndex.point].x,'x'),
                        this.s(this.data.currentDrawing.strokes[this.dIndex.line].points[this.dIndex.point].y,'y'));
                        ctx.lineCap = 'round';ctx.lineJoin = 'round';
                        ctx.stroke();
                        unfinished = true;
                    }
                    else
                    {
                        ctx.lineTo(this.s(this.data.currentDrawing.strokes[this.dIndex.line].points[this.dIndex.point].x,'x'),
                        this.s(this.data.currentDrawing.strokes[this.dIndex.line].points[this.dIndex.point].y,'y'));
                    }

                    this.dIndex.point++;
                    //this.drawIndex++;
                }
                this.drawIndex = this.drawTarget;
                if ( unfinished ){
                    this.drawIndex--;
                }
            }
            
            this.endCanvasMask(ctx);
        }

    },
    load:function(callback)
    {
        this.dIndex = {line:0,point:0};
        this.drawIndex = 0;
        var that        = this;
        
        this.drawingRequestId = MediaServer.requestMedia(
            'http://'+configOptions.contentServerIp+':'+configOptions.contentServerPort+'/drawing?id='+that.data.id,
            "data",
	    function(data)
            {
                try
                {
                    that.data.currentDrawing               = JSON.parse(data);
                }
                catch(e)
                {
                    return;
                }

                if ( that.data.currentDrawing.backgroundImage ){
                    console.log("requesting " + that.data.currentDrawing.backgroundImage)
                    that.imageRequestId = MediaServer.requestMedia(
			"data",
                        that.data.currentDrawing.backgroundImage,
                        function(data)
                        {
                            if(!that.aborted)
                            {
                                that.imageObj           = new Canvas.Image();
                
                                that.imageObj.src       = data;

                                that.ctxClipLeft        = that.left;
                                that.ctxClipTop         = that.top;
                
                                /*
                                * Setting images property
                                */
                                var imgFormat       = that.imageObj.width/that.imageObj.height;
                                var drawFormat      = that.width/that.height;

                                that.ctxClipLeft        += 0;
                                that.ctxClipTop         += 0;
                                that.ctxClipWidth       = that.width;
                                that.ctxClipHeight      = that.height;
                    
                                if(imgFormat > drawFormat) // The image is more landscape
                                {
                                    console.log("The image is more landscape")
                                    that.imgClipTop         = 0;
                                    that.imgClipHeight      = that.imageObj.height;
                    
                                    that.scaleRatioImage         = that.imgClipHeight/that.ctxClipHeight;
                    
                                    that.imgClipWidth       = that.width*that.scaleRatioImage;
                                    that.imgClipLeft        = (that.imageObj.width-that.imgClipWidth)/2;
                  
                                }
                                else // The image is more portrait
                                {
                                    console.log("The image is more portrait")
                                    that.imgClipLeft        = 0;
                                    that.imgClipWidth       = that.imageObj.width;
                    
                                    that.scaleRatioImage         = that.imgClipWidth/that.ctxClipWidth;

                                    that.imgClipHeight      = that.height*that.scaleRatioImage; 
                                    that.imgClipTop         = (that.imageObj.height-that.imgClipHeight)/2;

                                }

                                that.scaleRatioY  = that.scaleRatioX = that.scaleRatioImage;


                                //DRAWING
                                var imgFormat       = that.data.currentDrawing.width/that.data.currentDrawing.height;
                                var drawFormat      = that.width/that.height;

                                that.drawSize       = that.data.currentDrawing.points
                                if(imgFormat > drawFormat) // The image is more landscape
                                {
                                    that.offsetX            = 0;
                                    that.scaleRatio         = that.width/that.data.currentDrawing.width;

                                    that.offsetY            = (that.height-that.data.currentDrawing.height*that.scaleRatio)/2;
                                }
                                else // The image is more portrait
                                {
                                    that.offsetY            = 0;
                                    //that.ctxClipHeight      = that.width;

                                    that.scaleRatio         = that.height/that.data.currentDrawing.height;

                                    //that.ctxClipWidth       = that.data.height*scaleRatio;
                                    that.offsetX            = (that.width-that.data.currentDrawing.width*that.scaleRatio)/2;
                                }

                                if(!that.isReady)
                                {
                                    that.isReady            = true;
                                    callback();
                                }

                                that.finished           = false;
                                that.drawIndex          = 0;
                                that.init               = false;
                                that.needRedraw         = true;
                            }                
                        },
                        function(){
                            console.log("error");
                            mainGrid.removeRelem(that);
                        }
                    );
                }else{
                    var imgFormat       = that.data.currentDrawing.width/that.data.currentDrawing.height;
                    var drawFormat      = that.width/that.height;

                    that.drawSize       = that.data.currentDrawing.points
                    if(imgFormat > drawFormat) // The image is more landscape
                    {
                        that.offsetX            = 0;
                        that.scaleRatio         = that.width/that.data.currentDrawing.width;

                        that.offsetY            = (that.height-that.data.currentDrawing.height*that.scaleRatio)/2;

                    }
                    else // The image is more portrait
                    {
                        that.offsetY            = 0;
                        //                             that.ctxClipHeight      = that.width;

                        that.scaleRatio         = that.height/that.data.currentDrawing.height;

                        //                             that.ctxClipWidth       = that.data.height*scaleRatio;
                        that.offsetX            = (that.width-that.data.currentDrawing.width*that.scaleRatio)/2;
                    }

                    if(!that.isReady)
                    {
                        that.isReady            = true;
                        callback();
                    }

                    that.finished           = false;
                    that.drawIndex          = 0;
                    that.init               = false;
                    that.needRedraw         = true;
                }
            },
            function(error,code){
                //console.log("[Drawing] error "+code+":"+error);
                //setTimeout(function(){that.load()},that.data.timeout*1000);
                return;
            }
        );

        this.isTriggered = false;
    },
    cleanup:function()
    {
        this.aborted = true;

        if(!this.isReady){
            MediaServer.abort(this.drawingRequestId);
        }

        this.aborted = true;
        
        if(this.imageObj)
            this.imageObj.vgDestroy();

        if(this.isReady)
            delete(this.imageObj);
        else
            MediaServer.abort(this.requestId);
    }
};