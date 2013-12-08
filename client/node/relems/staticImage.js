exports.class = {
    requestId   :-1,
    redrawId    :0,
    colorId     :0,
    type        :'StaticImage',
    offset      :0,
    opaque      :true,
    draw:function(ctx)
    {
         if(this.isReady)
         {
             if( this.needRedraw)   
             {
                ctx.globalAlpha = 0.01;

               ctx.imageSmoothingEnabled = false;
               
               ctx.drawImage(
                   this.imageObj,
                   this.imgClipLeft,
                   this.imgClipTop,
                   this.imgClipWidth,
                   this.imgClipHeight,
                   this.ctxClipLeft,
                   this.ctxClipTop,
                   this.ctxDrawWidth,
                   this.ctxDrawHeight
                 );
               
               ctx.globalAlpha = 1;
             }
             
             if(this.redrawId < 100)
                this.redrawId++;
             else
                 this.needRedraw = false;
             
         }
    },
    isReady:false,
    load:function(callback)
    {
        var that        = this;

        this.isTriggered = false;
        
        this.requestId = MediaServer.requestMedia(
            that.data.url,
            function(data)
            {

                if(!that.aborted)
                {
                    that.imageObj           = new Canvas.Image();
                    
                    that.imageObj.src       = Buffer.concat(data);

                    that.ctxClipLeft        = that.left;
                    that.ctxClipTop         = that.top;
                    
                    /*
                     * Setting images property
                     */
                    var imgFormat       = that.imageObj.width/that.imageObj.height;
                    var drawFormat      = that.width/that.height;
                    
                    
                    
                    if(that.data.displayMode == 'center'){
                        if(that.imageObj.width > that.width || that.imageObj.height > that.height)
                            that.data.displayMode = 'cover';
                        else
                        {
                            that.ctxDrawWidth       = that.width;
                            that.ctxDrawHeight      = that.height;
                        }
                    }
                    if(that.data.displayMode == 'cover')
                    {
                        that.ctxClipLeft        += 0;
                        that.ctxClipTop         += 0;
                        that.ctxDrawWidth       = that.width;
                        that.ctxDrawHeight      = that.height;
                        
                        if(imgFormat > drawFormat) // The image is more landscape
                        {
                            that.imgClipTop         = 0;
                            that.imgClipHeight      = that.imageObj.height;
                            
                            var scaleRatio          = that.imgClipHeight/that.ctxDrawHeight;
                            
                            that.imgClipWidth       = that.width*scaleRatio;
                            that.imgClipLeft        = (that.imageObj.width-that.imgClipWidth)/2;
                          
                        }
                        else // The image is more portrait
                        {
                            that.imgClipLeft        = 0;
                            that.imgClipWidth       = that.imageObj.width;
                            
                            var scaleRatio          = that.imgClipWidth/that.ctxDrawWidth;

                            that.imgClipHeight      = that.height*scaleRatio; 
                            that.imgClipTop         = (that.imageObj.height-that.imgClipHeight)/2;

                        }
                    }
                    else if(this.data.displayMode == 'fit')
                    {
                        that.imgClipLeft        = 0;
                        that.imgClipTop         = 0;
                        that.imgClipHeight      = that.imageObj.height;
                        that.imgClipWidth       = that.imageObj.width;
                        
                        if(imgFormat > drawFormat) // The image is more landscape
                        {
                            that.ctxClipLeft        = 0;
                            that.ctxClipWidth       = that.width;
                            
                            var scaleRatio          = that.imgClipWidth/that.width;
                            
                            that.ctxClipHeight      = that.imageObj.width*scaleRatio;
                            that.ctxClipTop         = (that.height-ctxClipHeight)/2;
                          
                        }
                        else // The image is more portrait
                        {
                            that.ctxClipTop         = 0;
                            that.ctxClipHeight      = that.width;
                            
                            var scaleRatio          = that.imgClipHeight/that.height;
                            
                            that.ctxClipWidth       = that.imageObj.height*scaleRatio;
                            that.ctxClipLeft        = (that.width-ctxClipWidth)/2;
                        }
                    }
                     else if(that.data.displayMode == 'stretch')
                     {
                        that.imgClipLeft        = 0;
                        that.imgClipTop         = 0;
                        that.imgClipWidth       = that.imageObj.width;
                        that.imgClipHeight      = that.imageObj.height;
                        that.ctxClipLeft        += 0;
                        that.ctxClipTop         += 0;
                        that.ctxDrawWidth       = that.width;
                        that.ctxDrawHeight      = that.height;
                    }
                    
                    callback();
                }
                that.isReady            = true;
                
            },
            function(){
                console.log("error");
                mainGrid.removeRelem(that);
            }
        );
    },
    cleanup:function()
    {
        this.aborted = true;
        
        if(this.isReady)
            delete(this.imageObj);
        else
            MediaServer.abort(this.requestId);
   }
};