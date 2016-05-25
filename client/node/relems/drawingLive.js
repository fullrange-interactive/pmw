exports.class = { 
  drawingRequestId    : -1,
  imageRequestId      : -1,
  type                : 'DrawingLive',
  transitionEnded     : false, 
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
  drawnOnce           : false, 
  s: function (n,what)
  {
    var retval = what == 'x' ? n*this.width+this.left : n*this.height+this.top;
    return retval*this.scaleRatio + (what == 'x' ? this.offsetX : this.offsetY);
  },
  drawZone: function (ctx,x,y,width,height)
  {
    // ctx.save();

    // ctx.beginPath();
    // ctx.rect(x,y,width,height);
        
    // ctx.clip();
        
    // var t = (new Date()).getTime()-this.startTime.getTime()-4000;

    // if ( this.cache != null ){
    //   ctx.putImageData(this.cache, this.left, this.top, x, y, width + this.left, height + this.top);
    // }

    // ctx.restore();
  },
  isInsideCanvas : function(coordX,coordY,strokeWidth)
  {
    var isInside =      coordX+strokeWidth >= 0 
                    &&  coordY+strokeWidth >= 0 
                    &&  coordX-strokeWidth <= this.localWidth 
                    &&  coordY-strokeWidth <= this.localHeight;

    return true;//isInside;
  },
  draw: function(ctx)
  {
    // try{
      if (!this.drawnOnce) {
        ctx.save();
        ctx.fillStyle = "black";
        ctx.fillRect(this.left, this.top, this.width, this.height);
        ctx.restore();
        if (this.transitionEnded)
          this.drawnOnce = true;
      }

      var xCoord = null;
      var yCoord = null; 
      var lastxCoord = null;
      var lastyCoord = null;

      strokeLoop:
      for(var i = this.strokes.length-1; i >= 0; i--){

        var stroke = this.strokes[i].stroke;
        
        // var tStart = this.strokes[i].dateLast.getTime() - this.strokes[i].dateStart.getTime();
        // var tNow = new Date().getTime() - this.strokes[i].dateStart.getTime();
        // var dt = tNow - tStart;
        // var iStart = Math.floor(tStart/1000.0/stroke.duration * stroke.points.length) - 1;
        // var iEnd = Math.ceil(tNow/1000.0/stroke.duration * stroke.points.length);

        var iStart = 0;
        var iEnd = stroke.points.length;

        var strokeWidth = stroke.lineWidth*this.width;
            
        // console.log(iEnd-iStart);
                
        if ( isNaN(iEnd-iStart) ){
          this.strokes.splice(i,1);
          continue;
        }
            
        if ( iStart < 0 )
          iStart = 0;

        if ( iStart >= stroke.points.length ){
          if(iEnd > stroke.points.length-1)
            this.strokes.splice(i,1);
          continue;
        }

        // lastxCoord = this.s(stroke.points[iStart].x,'x');
        // lastyCoord = this.s(stroke.points[iStart].y,'y');

        // /* Trim the first points of the stroke until one is visible */
        
        // trimLoop:
        // for(;iStart < stroke.points.length;)
        // {
          xCoord = this.s(stroke.points[iStart].x,'x');
          yCoord = this.s(stroke.points[iStart].y,'y');

        //   if(this.isInsideCanvas(xCoord,yCoord,strokeWidth))
        //   {
            ctx.save();
            ctx.beginPath();

            ctx.strokeStyle = stroke.color;
            ctx.lineWidth = stroke.lineWidth*this.width;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
                
            // ctx.moveTo(lastxCoord,lastyCoord);

            // ctx.lineTo(xCoord,yCoord); 

            ctx.moveTo(xCoord,yCoord);
            ctx.lineTo(xCoord,yCoord); 


            // iStart++;           

            // break trimLoop;
          // }

        //   if(iStart == stroke.points.length-1)
        //   {
        //     this.strokes.splice(i,1); 
            
        //     break strokeLoop;
        //   }

        //   iStart++;
        // }

        // var isLastPointIn = false;

        for(var j = iStart+1; j < iEnd && j < stroke.points.length; j++){

          // /* Draw only if the last or current point is visible */
          // isThisPointIn = this.isInsideCanvas(xCoord,yCoord,strokeWidth);

          // if(isThisPointIn)
          // {
          //   if(!isLastPointIn)
          //     ctx.lineTo(lastxCoord,lastyCoord);

            xCoord = this.s(stroke.points[j].x,'x');
            yCoord = this.s(stroke.points[j].y,'y');

            ctx.lineTo(xCoord,yCoord);
          // }
          // else
          // {
          //   if(isLastPointIn)
          //   {
          //     xCoord = this.s(stroke.points[j].x,'x');
          //     yCoord = this.s(stroke.points[j].y,'y');

          //     ctx.lineTo(xCoord,yCoord);
          //   }
          // }

          // isLastPointIn = isThisPointIn;

          // lastxCoord = xCoord;
          // lastyCoord = yCoord;          
        }

        ctx.stroke();
        ctx.restore();

        // this.strokes[i].dateLast = new Date();

        // if(iEnd > stroke.points.length-1)
          this.strokes.splice(i,1);
      }
      this.needRedraw = true;
    // }catch(e){
    //   console.log("There was an exception...");
    //   this.needRedraw = true;
    // }
  },
  onDataStream: function(data){
    // console.log("[DrawingLive] Got something...");
    if ( data.type == "stroke" ){
      // console.log("[DrawingLive] Got stroke");
      this.strokes.push({dateStart: new Date(), dateLast: new Date(), stroke: data.stroke});
      // console.log(data.stroke);
    }
  },
  load:function(callback)
  {
    serverStreamer.register(this, this.onDataStream.bind(this));
        
    var width = this.width;
    var height = this.height;
        // (what == 'x' ? this.offsetX+this.left : this.offsetY+this.top);
    // var imgFormat       = width/height;


    var imgFormat       = width/height;

    var drawFormat      = this.width/this.height;

    console.log("localHeight: "+this.localHeight+" localWidth: "+this.localWidth)

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
    setTimeout(function (){
      this.transitionEnded = true;
    }.bind(this), 3000);
    callback();
  },
  cleanup:function()
  {
    serverStreamer.unregister(this);
  }
};