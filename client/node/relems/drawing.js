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
  s: function (n, what)
  {
    if (what === 'x')
      return n * this.width + this.left;
    else if (what === 'y')
      return n * this.height + this.top;
    else if (what === 's')
      return n * this.width
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
      console.log('draw from cache!');
      ctx.drawImage(this.cacheAsImage, this.left, this.top, x, y, width + this.left, height + this.top);
    }
    ctx.restore();

  },
  draw: function(ctx)
  {
    var t = (new Date()).getTime()-this.startTime.getTime()-60000;
    this.needRedraw = true;

    if ( this.cache != null ){
      this.beginCanvasMask(ctx);

      var sx = (this.left < 0)?0:this.left;
      var sy = (this.top < 0)?0:this.top;
      var sw = (this.left + this.width > mainGrid.wrapper.width)?mainGrid.wrapper.width:this.width;
      var sh = (this.top + this.height > mainGrid.wrapper.height)?mainGrid.wrapper.height:this.height;

      // ctx.putImageData(this.cache, sx + mainGrid.wrapper.base.x, sy + mainGrid.wrapper.base.y);
      this.endCanvasMask(ctx);
      ctx.putImageData(this.cache, this.left, this.top, 0, 0, this.width, this.height);
      return;
    }

    if(this.isReady && !this.finished && !this.aborted)
    {
      this.beginCanvasMask(ctx);

      var x = this.left;
      var y = this.top;
      var width = this.width;
      var height = this.height;

      var drawing = this.data.currentDrawing;
      var strokes = drawing.strokes;

      if(!this.init && (drawing.backgroundColor || drawing.backgroundImage) || mainGrid.crossfading )
      {
        if ( drawing.backgroundImage != null ){
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
          if (this.drawAt === 0) {
            ctx.fillStyle=drawing.backgroundColor;
            ctx.fillRect(this.left,this.top,this.width,this.height);
          }
        }
      }

      if (mainGrid.crossfading) {
        if (this.drawAt != 0 && !this.cache) {
          var sx = ((this.left < 0)?0:this.left) + mainGrid.wrapper.base.x;
          var sy = ((this.top < 0)?0:this.top) + mainGrid.wrapper.base.y;
          var sw = (this.left + this.width > mainGrid.wrapper.width)?mainGrid.wrapper.width:this.width;
          var sh = (this.top + this.height > mainGrid.wrapper.height)?mainGrid.wrapper.height:this.height;

          console.log(sx + ' ' + sy + ' ' + sw + ' ' + sh);

          this.cache = ctx.getImageData(Math.round(sx), Math.round(sy), Math.round(sw), Math.round(sh));
        }
        this.endCanvasMask(ctx);
        return;
      }

      // var drawSpeed = this.drawSize/this.drawDuration;
      // if ( drawSpeed < 50 ) drawSpeed = 50;
      // this.drawTarget = Math.floor(t*drawSpeed/1000)
    

      for (var i = this.drawAt; i < drawing.points; i++) {
        var points = strokes[this.strokeAt].points;

        if (points[this.pointAt].timerAt > t){
          break;
        }

        var x1 = points[this.pointAt].x;
        var y1 = points[this.pointAt].y;
        if (points.length === 1) {
          var x2 = points[this.pointAt].x + 0.0001;
          var y2 = points[this.pointAt].y + 0.0001;
        } else {
          var x2 = points[this.pointAt + 1].x;
          var y2 = points[this.pointAt + 1].y;
        }

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = strokes[this.strokeAt].color;
        ctx.lineWidth = this.s(strokes[this.strokeAt].lineWidth, 's');

        ctx.beginPath();
        ctx.moveTo(this.s(x1, 'x'), this.s(y1, 'y'));
        ctx.lineTo(this.s(x2, 'x'), this.s(y2, 'y'));
        ctx.stroke();

        this.pointAt++;
        if (this.pointAt >= points.length - 1) {
          // We reached the end of a stroke
          if (this.strokeAt + 1 >= strokes.length) {
            // The drawing is 100% finished
            MediaServer.requestMedia('http://'+configOptions.contentServerIp+':'+configOptions.contentServerPort+'/drawing?id='+drawing._id+'&sentOnce=1',"data",function(data){},function(error,code){});
            this.finished        = true;
            var sx = ((this.left < 0)?0:this.left) + mainGrid.wrapper.base.x;
            var sy = ((this.top < 0)?0:this.top) + mainGrid.wrapper.base.y;
            var sw = (this.left + this.width > mainGrid.wrapper.width)?mainGrid.wrapper.width:this.width;
            var sh = (this.top + this.height > mainGrid.wrapper.height)?mainGrid.wrapper.height:this.height;

            console.log(sx + ' ' + sy + ' ' + sw + ' ' + sh);

            this.cache = ctx.getImageData(Math.round(sx), Math.round(sy), Math.round(sw), Math.round(sh));
            break;
          }
          this.strokeAt++;
          this.pointAt = 0;
        }
        this.drawAt++;
      }
            
      this.endCanvasMask(ctx);
    }

  },
  load:function(callback)
  {
    this.strokeAt = 0;
    this.pointAt = 0;
    this.drawAt = 0;

    console.log(this.data);
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
            that.data.currentDrawing.backgroundImage,
            "data",
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