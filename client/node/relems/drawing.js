exports.class = { 
    requestId   :-1,
    type        :'Drawing',
    drawIndex   :0,
    nbIterations:500,
    drawTarget  :0,
    drawDuration:10,
    isReady     :false,
    finished    :false,
    init        :false,
    opaque      :true,
    s           :function(n,what)
    {
           return n*this.scaleRatio + (what == 'x' ? this.offsetX+this.left : this.offsetY+this.top);
    },
	doDraw:function(ctx,startAt,endAt,dIndex,x,y,width,height,force)
	{
		var x1 = x;
		var x2 = x1+width;
		var y1 = y;
		var y2 = y1+height;
        if((!this.init || force) && this.data.currentDrawing.backgroundColor!=='null' || mainGrid.crossfading)
        {
            
            ctx.fillStyle=this.data.currentDrawing.backgroundColor;
            ctx.fillRect(this.left,this.top,this.width,this.height);
            
               if(!mainGrid.crossfading)
                   this.init = true;                  
        }
         var drawSpeed = this.drawSize/this.drawDuration;
         if ( drawSpeed < 50 ) drawSpeed = 50;
         var drawTarget = Math.floor(endAt*drawSpeed/1000);
		 var drawIndex = startAt;
         var unfinished = false;
		 
		 if ( drawTarget > this.drawSize ){
			 drawTarget = this.drawSize-1;
		 }
		 
		 //this.needRedraw = false;
		
         if(!mainGrid.crossfading && endAt > 0 && drawTarget - drawIndex > 2){
             for(var i=drawIndex;i<drawTarget;i++)
             {
				 /*
				 if ( dIndex.line < this.data.currentDrawing.strokes.length && dIndex.point < this.data.currentDrawing.strokes[dIndex.line].points.length ){
					 var p = this.data.currentDrawing.strokes[dIndex.line].points[dIndex.point];
					 if ( ! (p.x >= x1 && p.x <= x2 && p.y >= y1 && p.y <= y2) ){
						 dIndex.point++;
						 if ( dIndex.point >= this.data.currentDrawing.strokes[dIndex.line].length ){
							 dIndex.point = 0;
							 dIndex.line++;
						 }
						 continue;
					 }
				 }*/
                 if(dIndex.point == this.data.currentDrawing.strokes[dIndex.line].points.length)
                 {
                     ctx.lineCap = 'round';ctx.lineJoin = 'round';
                     ctx.stroke();

                     dIndex.line++;
                     dIndex.point = 0;

                     if(dIndex.line == this.data.currentDrawing.strokes.length)
                     {
                            MediaServer.requestMedia('http://'+configOptions.contentServerIp+':'+configOptions.contentServerPort+'/drawing?id='+this.data.currentDrawing._id+'&sentOnce=1',function(data){},function(error,code){});
                            this.finished        = true;
                            this.needRedraw      = false;
                            break;
                     }

                     ctx.strokeStyle=this.data.currentDrawing.strokes[dIndex.line].color;
                     ctx.lineWidth=parseInt(this.data.currentDrawing.strokes[dIndex.line].lineWidth*this.scaleRatio);

                     ctx.beginPath();                        
                     ctx.moveTo(this.s(this.data.currentDrawing.strokes[dIndex.line].points[dIndex.point].x,'x'),
                                this.s(this.data.currentDrawing.strokes[dIndex.line].points[dIndex.point].y,'y'));

                 }
                 // If beginning
                 else if(i == drawIndex)
                 {
                     ctx.strokeStyle=this.data.currentDrawing.strokes[dIndex.line].color;
                     ctx.lineWidth=parseInt(this.data.currentDrawing.strokes[dIndex.line].lineWidth*this.scaleRatio);

                     ctx.beginPath();  

                     if(dIndex.point != 0)
                     {
                         ctx.moveTo(this.s(this.data.currentDrawing.strokes[dIndex.line].points[dIndex.point-1].x,'x'),
                                    this.s(this.data.currentDrawing.strokes[dIndex.line].points[dIndex.point-1].y,'y'));
                      ctx.lineTo(this.s(this.data.currentDrawing.strokes[dIndex.line].points[dIndex.point].x,'x'),
                                this.s(this.data.currentDrawing.strokes[dIndex.line].points[dIndex.point].y,'y'));
                     }
                     else
                     {


                     ctx.moveTo(this.s(this.data.currentDrawing.strokes[dIndex.line].points[dIndex.point].x,'x'),
                                this.s(this.data.currentDrawing.strokes[dIndex.line].points[dIndex.point].y,'y'));
                     }
                 }
                 // last point
                 else if(i == drawTarget - 1) // Last point
                 {
                     ctx.lineTo(this.s(this.data.currentDrawing.strokes[dIndex.line].points[dIndex.point].x,'x'),
                                this.s(this.data.currentDrawing.strokes[dIndex.line].points[dIndex.point].y,'y'));
                      ctx.lineCap = 'round';ctx.lineJoin = 'round';
                     ctx.stroke();
                     unfinished = true;
                 }
                 else
                 {
                     ctx.lineTo(this.s(this.data.currentDrawing.strokes[dIndex.line].points[dIndex.point].x,'x'),
                                this.s(this.data.currentDrawing.strokes[dIndex.line].points[dIndex.point].y,'y'));
                 }

                 dIndex.point++;
             }
         }
		 return unfinished;
	},
    drawZone:function(ctx,x,y,width,height)
    {
		
        ctx.save();

        ctx.beginPath();
        ctx.rect(x,y,width,height);
        
        ctx.clip();
        
        var t = (new Date()).getTime()-this.startTime.getTime()-4000;
		this.doDraw(ctx,0,t,{line:0,point:0},true);
		//console.error("AAAAA")
		
        ctx.restore();
		
    },
    draw:function(ctx)
    {
        var t = (new Date()).getTime()-this.startTime.getTime()-4000;
                //console.error(".");
        //this.needRedraw = true;

        if(this.isReady && !this.finished && !this.aborted)
        {
           
           this.beginCanvasMask(ctx);
           var unfinished = false;
           if((!this.init) && this.data.currentDrawing.backgroundColor!=='null' || mainGrid.crossfading)
           {
            
               ctx.fillStyle=this.data.currentDrawing.backgroundColor;
               ctx.fillRect(this.left,this.top,this.width,this.height);
            
                  if(!mainGrid.crossfading)
                      this.init = true;                  
           }
           //var unfinished = this.doDraw(ctx,this.drawIndex,t,this.dIndex)
           this.drawIndex = this.drawTarget;
           if ( unfinished ){
               this.drawIndex--;
           }
            
           this.endCanvasMask(ctx);
        }

    },
    load:function(callback)
    {
        this.dIndex = {line:0,point:0};
        this.drawIndex = 0;
        var that        = this;
        
        this.requestId = MediaServer.requestMedia(
            'http://'+configOptions.contentServerIp+':'+configOptions.contentServerPort+'/drawing?id='+that.data.id,
            function(data)
            {
                    //console.log("[Drawing] Init ");

                    try
                    {
                        that.data.currentDrawing               = JSON.parse(data);
                    }
                    catch(e)
                    {
                        //console.log("[Drawing] Error, ignoring this one");
                        
                        //setTimeout(function(){that.load()},that.data.timeout*1000);
                        return;
                    }
//                     console.error( that.data.currentDrawing);
                   // Taken from static image 
                    
                    var imgFormat       = that.data.currentDrawing.width/that.data.currentDrawing.height;
                    var drawFormat      = that.width/that.height;
                    
                    that.drawSize       = that.data.currentDrawing.points
                    //that.drawSize       = Math.max(Math.round(that.data.currentDrawing.points/that.nbIterations)+1,2);
                    
//                         that.imgClipLeft        = 0;
//                         that.imgClipTop         = 0;
//                         that.imgClipHeight      = that.data.height;
//                         that.imgClipWidth       = that.data.width;
                        
                        if(imgFormat > drawFormat) // The image is more landscape
                        {
                            that.offsetX            = 0;
//                             that.ctxClipWidth       = that.width;
                            
                            that.scaleRatio         = that.width/that.data.currentDrawing.width;
                            
//                             that.ctxClipHeight      = that.data.width*scaleRatio;
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
                    
                    //setTimeout(function(){that.load()},that.data.timeout*1000);
            },
            function(error,code){
                    //console.log("[Drawing] error "+code+":"+error);
                    //setTimeout(function(){that.load()},that.data.timeout*1000);
                    return;
            }
        );
    },
    cleanup:function()
    {
        this.aborted = true;
        
        if(!this.isReady){
            MediaServer.abort(this.requestId);
        }
   }
};
