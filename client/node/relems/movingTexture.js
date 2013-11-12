exports.class = {
    type        : 'MovingTexture',
    offset      : 0,
    draw        : function(ctx)
    {
         if(this.isReady)
         {
            that.ctxClipLeft    = (that.ctxClipLeftIncrement+that.ctxClipLeftIncrement)%this.ctxDrawWidth;
            that.ctxClipTop     = (that.ctxClipTopIncrement+that.ctxClipTopIncrement)%this.ctxDrawHeight;

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
         }

    },
    isReady     : false,
    load        : function(callback)
    {
        this.isTriggered = false;
       
        var that        = this;
        var http        = require('http');
        var url         = require('url');
        
        var urlObj      = url.parse(this.data.url);
        
        var options = {
          hostname      : urlObj.hostname,
          port          : urlObj.port,
          path          : urlObj.pathname,
          method        : 'GET',
          encoding      : null
        };

        
        this.req = http.request(options, function(res)
        {    
            var data = [];

            res.on('data', function (chunk) {
                data.push(chunk);
            });
          
            res.on('end',function(){
                
                if(res.statusCode != 200)
                {
                    mainGrid.removeRelem(that);
                    return;
                }
                    
                if(!that.aborted)
                {
                    that.imageObj           = new Canvas.Image();
                    that.imageObj.onload    = (function(){/**/});
                    that.imageObj.src       = Buffer.concat(data);
                    
                    that.ctxClipLeft        = that.left;
                    that.ctxClipTop         = that.top;
                    
                    /*
                     * Setting images property
                     */                    
                    var imgFormat       = that.imageObj.width/that.imageObj.height;
                    var drawFormat      = that.width/that.height;

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
                        that.ctxClipLeftIncrement = this.data.speed;
                        that.ctxClipTopIncrement = 0;
                      
                    }
                    else // The image is more portrait
                    {
                        that.imgClipLeft        = 0;
                        that.imgClipWidth       = that.imageObj.width;
                        
                        var scaleRatio          = that.imgClipWidth/that.ctxDrawWidth;

                        that.imgClipHeight      = that.height*scaleRatio; 
                        that.imgClipTop         = (that.imageObj.height-that.imgClipHeight)/2;
                        that.ctxClipLeftIncrement = 0;
                        that.ctxClipTopIncrement = this.data.speed;
                    }

                    that.isReady            = true;
                    callback();
                }
            });
        });

        this.req.on('error', function(e) {
          mainGrid.removeRelem(that);
        });

        this.req.end(); 

    },
    cleanup:function()
    {
        this.aborted = true;
        if(this.ready)
            delete(this.imageObj);
        else
            this.req.abort();
   }
};