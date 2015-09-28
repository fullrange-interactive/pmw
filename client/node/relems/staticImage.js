var imagesCache = {};

var processImage = function (that, callback){
    that.ctxClipLeft        = that.left;
    that.ctxClipTop         = that.top;

    /*
    * Setting images property
    */
    var imgFormat       = that.imageObj.width/that.imageObj.height;
    var drawFormat      = that.width/that.height;


    if(that.data.displayMode == 'center')
    {

        that.ctxClipWidth       = that.imageObj.width > that.width ? that.width : that.imageObj.width;
        that.ctxClipHeight      = that.imageObj.height > that.height ? that.height :that.imageObj.height ;
        that.ctxClipLeft        += that.imageObj.width < that.width ? (that.width-that.imageObj.width)/2:0;
        that.ctxClipTop         += that.imageObj.height < that.height ? (that.height-that.imageObj.height)/2:0;

        that.imgClipLeft        = that.imageObj.width > that.width ? (that.imageObj.width-that.width)/2:0;
        that.imgClipTop         = that.imageObj.height > that.height ? (that.imageObj.height-that.height)/2:0;
        that.imgClipWidth       = that.imageObj.width < that.width ? that.imageObj.width : that.width;
        that.imgClipHeight      = that.imageObj.height < that.height ? that.imageObj.height : that.height;

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

            that.scaleRatio         = that.imgClipHeight/that.ctxClipHeight;

            that.imgClipWidth       = that.width*that.scaleRatio;
            that.imgClipLeft        = (that.imageObj.width-that.imgClipWidth)/2;

        }
        else // The image is more portrait
        {
            that.imgClipLeft        = 0;
            that.imgClipWidth       = that.imageObj.width;

            that.scaleRatio         = that.imgClipWidth/that.ctxClipWidth;

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
    that.isReady            = true;
    
    console.log("==== THE IMAGE HAS BEN DRAWNTH" + that.imageObj + " : " + that.imageObj.width);
    
    callback();
}

exports.class = { 
    requestId   :-1,
    redrawId    :0,
    colorId     :0,
    type        :'StaticImage',
    offset      :0,
    opaque      :true,
    isReady     :false,
    draw        :function(ctx)
    {

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

         //console.log("[relem.staticImage] "+this.data.displayMode+" Full Draw "+this.imgClipLeft+" "+this.imgClipTop+" "+this.imgClipWidth+" "+this.imgClipHeight+" "+this.ctxClipLeft+" "+this.ctxClipTop+" "+this.ctxClipWidth+" "+this.ctxClipHeight);

    },
    drawZone:function(ctx,x,y,width,height)
    {

        ctx.imageSmoothingEnabled = false;

        if(this.data.displayMode != 'cover')
        {
            ctx.drawImage(

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
         }
         else if(this.data.displayMode == 'center')
         {
                   ctx.drawImage(
    /*                   this.imageObj,
                       Math.round(x-this.imgClipLeft),
                       Math.round(y-this.imgClipTop),
                       Math.round(width/this.scaleRatioX),
                       Math.round(height/this.scaleRatioY),
                               */  

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
               }
               else
               {
                   ctx.drawImage(
    /*                   this.imageObj,
                       Math.round(x-this.imgClipLeft),
                       Math.round(y-this.imgClipTop),
                       Math.round(width/this.scaleRatioX),
                       Math.round(height/this.scaleRatioY),
                               */  

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
               } 
//                }
// ctx.beginPath();
// ctx.lineWidth="1";
// ctx.strokeStyle="red";
// ctx.rect(x,y,width,height); 
// ctx.stroke(); 

    },
    load:function(callback)
    {
        var that        = this;

        this.isTriggered = false;
        
        if ( imagesCache[this.data.url] ){
            this.imageObj = imagesCache[this.data.url];
            processImage(that, callback);
        }else{
            this.requestId = MediaServer.requestMedia(
                that.data.url,
    	        'data',
                function(data)
                {
                    if(!that.aborted)
                    {
                        that.imageObj           = new Canvas.Image();
                        
                        console.log("Image created");                    
                        that.imageObj.src       = data;
                        console.log("Data set");
                        
                        imagesCache[that.data.url] = that.imageObj;
                        
                        processImage(that, callback);
                    }
                },
                function(){
                    console.log("error");
                    mainGrid.removeRelem(that);
                }
            );
        }
    },
    cleanup:function()
    {
        this.aborted = true;
        
        //if(this.imageObj)
            //this.imageObj.vgDestroy();

        //if(this.isReady)
            //delete(this.imageObj);
        if(!this.isReady)
            MediaServer.abort(this.requestId);
   }
};
