exports.class = {
    requestId   :-1,
    redrawId    :0,
    colorId     :0,
    type        :'ImageGallery',
    offset      :0,
    opaque      :true,
    draw        :function(ctx)
    {

        ctx.globalAlpha = 1;

        ctx.imageSmoothingEnabled = false;

        ctx.drawImage(
            this.imageObj,
            this.imgClipLeft,
            this.imgClipTop,
            this.imgClipWidth,
            this.imgClipHeight,
            this.ctxClipLeft,
            this.ctxClipTop,
            this.ctxClipWidth,
            this.ctxClipHeight
        );

//         console.log("[relem.staticImage] "+this.data.displayMode+" Full Draw "+this.imgClipLeft+" "+this.imgClipTop+" "+this.imgClipWidth+" "+this.imgClipHeight+" "+this.ctxClipLeft+" "+this.ctxClipTop+" "+this.ctxClipWidth+" "+this.ctxClipHeight);

    },
    drawZone:function(ctx,x,y,width,height)
    {
//         var imgClipLeft
             ctx.globalAlpha = 1;
//             console.log(this.imgClipLeft);
//             console.log(this.imgClipTop);
                ctx.imageSmoothingEnabled = false;
//                 console.log("[relem.staticImage] Drawzone: from  ["+(width*this.scaleRatio)+"x"+(height*this.scaleRatio)+"] @ ["+(x-this.ctxClipLeft)+":"+(y-this.ctxClipTop)+"] to ["+width+"x"+height+"] @ ["+x+":"+y+"] ratio: "+this.scaleRatioX+":"+this.scaleRatioY+"");
// 
//                console.log(''+this.imgClipLeft+'+'+'('+x+'-'+'('+this.ctxClipLeft+')'+')');
//                console.log(''+this.imgClipTop+'+'+'('+y+'-'+'('+this.ctxClipTop+')'+')');

               ctx.drawImage(
/*                   this.imageObj,
                   Math.round(x-this.imgClipLeft),
                   Math.round(y-this.imgClipTop),
                   Math.round(width/this.scaleRatioX),
                   Math.round(height/this.scaleRatioY),
                           */  
                   this.imageObj,
                   Math.round((x-this.ctxClipLeft)*this.scaleRatioX),
                   Math.round((y-this.ctxClipTop)*this.scaleRatioY),
                   Math.round(width*this.scaleRatioX),
                   Math.round(height*this.scaleRatioY),
                   x,
                   y,
                   width,
                   height
                 );
               
// ctx.beginPath();
// ctx.lineWidth="1";
// ctx.strokeStyle="red";
// ctx.rect(x,y,width,height); 
// ctx.stroke(); 

    },
    isReady:false,
    currentImageIndex:0,
    loadNextImage:function(callback)
    {
        var that = this;
//         this.isTriggered = false;
        
        this.requestId = MediaServer.requestMedia(
            that.data.url[that.currentImageIndex],
            function(data)
            {

                if(!that.aborted)
                {
                     if(that.imageObj)
                     {
                         console.log("[imageGallery] vgDestroy");

                        that.imageObj.vgDestroy();
                     }

                    if(that.imageObj)
                    {
                         console.log("[imageGallery] delete");
                        delete(that.imageObj);
                        that.imageObj =  null;
                    }
                    
                    global.gc();
        
                    that.imageObj           = new Canvas.Image();
                    
                    that.imageObj.src       = Buffer.concat(data);
                    
                    delete(data);
                    data = null;
                    
                    global.gc();

                    that.ctxClipLeft        = that.left;
                    that.ctxClipTop         = that.top;
                    
                    /*
                     * Setting images property
                     */
                    var imgFormat       = that.imageObj.width/that.imageObj.height;
                    var drawFormat      = that.width/that.height;
                    
                    
                    
                    if(that.data.displayMode == 'center')
                    {
                        that.scaleRatio = 1;
                        if(that.imageObj.width > that.width || that.imageObj.height > that.height)
                            that.data.displayMode = 'cover';
                        else
                        {
                            that.ctxClipWidth       = that.width;
                            that.ctxClipHeight      = that.height;
                        }
                    }
                    
                    if(that.data.displayMode == 'cover')
                    {
                        that.ctxClipLeft        += 0;
                        that.ctxClipTop         += 0;
                        that.ctxClipWidth       = that.width;
                        that.ctxClipHeight      = that.height;
                        
                        if(imgFormat > drawFormat) // The image is more landscape
                        {
                            that.imgClipTop         = 0;
                            that.imgClipHeight      = that.imageObj.height;
                            
                            that.scaleRatio          = that.imgClipHeight/that.ctxClipHeight;
                            
                            that.imgClipWidth       = that.width*that.scaleRatio;
                            that.imgClipLeft        = (that.imageObj.width-that.imgClipWidth)/2;
                          
                        }
                        else // The image is more portrait
                        {
                            that.imgClipLeft        = 0;
                            that.imgClipWidth       = that.imageObj.width;
                            
                            that.scaleRatio          = that.imgClipWidth/that.ctxClipWidth;

                            that.imgClipHeight      = that.height*that.scaleRatio; 
                            that.imgClipTop         = (that.imageObj.height-that.imgClipHeight)/2;

                        }
                    }
                    else if(that.data.displayMode == 'fit')
                    {
                        that.imgClipLeft        = 0;
                        that.imgClipTop         = 0;
                        that.imgClipHeight      = that.imageObj.height;
                        that.imgClipWidth       = that.imageObj.width;
                        
                        if(imgFormat > drawFormat) // The image is more landscape
                        {
                            that.ctxClipLeft        += 0;
                            that.ctxClipWidth       = that.width;
                            
                            that.scaleRatio          = that.imgClipWidth/that.width;
                            
                            that.ctxClipHeight      = that.imageObj.height/that.scaleRatio;
                            that.ctxClipTop         += (that.height-that.ctxClipHeight)/2;
                          
                        }
                        else // The image is more portrait
                        {
                            that.ctxClipTop         += 0;
                            that.ctxClipHeight      = that.height;
                            
                            that.scaleRatio          = that.imgClipHeight/that.height;
                            
                            that.ctxClipWidth       = that.imageObj.width/that.scaleRatio;
                            that.ctxClipLeft        += (that.width-that.ctxClipWidth)/2;
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
                        that.ctxClipWidth       = that.width;
                        that.ctxClipHeight      = that.height;
                        
                        that.scaleRatioY         =      that.imgClipHeight/that.height;
                        that.scaleRatioX         =      that.imgClipWidth/that.width;
                    }
                    
                    if(that.data.displayMode != 'stretch')
                    {
                        that.scaleRatioY  = that.scaleRatioX = that.scaleRatio;
                    }
                    
                    callback();
                    setTimeout(function(){that.loadNextImage(callback)},parseInt(that.data.interval));
                }
                that.isReady            = true;
                that.needRedraw         = true;
            },
            function(){
                console.log("error");
                mainGrid.removeRelem(that);
            }
        );
        
        this.currentImageIndex = (this.currentImageIndex+1)%this.data.url.length;
                  
    },
    load:function(callback)
    {
        
        var that        = this;
        
        setTimeout(function(){

                that.loadNextImage(callback);
                
                
             },1);
       
        console.log("[imageGallery] Interval:"+that.data.interval)

    },
    cleanup:function()
    {
        this.aborted = true;
        
        if(this.imageObj)
            this.imageObj.vgDestroy();

        if(this.isReady)
            delete(this.imageObj);
        else
            MediaServer.abort(this.requestId);
   }
};