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
    drawZone:function(ctx,x,y,width,height)
    {
       console.log("[Drawing] Unimplemented selective redraw asked ");
    },
//         var dIndex = {line:0,point:0};
// 
//         ctx.save();
// 
//         // Clip to allowed drawing zone
//         ctx.beginPath();
//         ctx.rect(x,y,width,height); 
//         
//         // Clip to the current path
//         ctx.clip();
// 
//             for(var i=0;i<=this.drawIndex;i++)
//             {
//                 // If new line 
//                 if(dIndex.point == this.data.currentDrawing.strokes[dIndex.line].points.length)
//                 {      
// //                     console.error("New line");
//                     
//                     ctx.lineCap = 'round';ctx.lineJoin = 'round';
//                     ctx.stroke();
//                  
//                     dIndex.line++;
//                     dIndex.point = 0;
// 
//                     ctx.strokeStyle='#'+this.data.currentDrawing.strokes[dIndex.line].color;
//                     ctx.lineWidth=parseInt(this.data.currentDrawing.strokes[dIndex.line].lineWidth*this.scaleRatio);
//                     
//                     ctx.beginPath();                        
//                     ctx.moveTo(this.s(this.data.currentDrawing.strokes[dIndex.line].points[dIndex.point].x,'x'),
//                                this.s(this.data.currentDrawing.strokes[dIndex.line].points[dIndex.point].y,'y'));
//                     
//                 }
//                 // If beginning
//                 else if(i == 0)
//                 {
// //                      console.error("Begin Iteration");
// 
//                     ctx.strokeStyle='#'+this.data.currentDrawing.strokes[dIndex.line].color;
//                     ctx.lineWidth=parseInt(this.data.currentDrawing.strokes[dIndex.line].lineWidth*this.scaleRatio);
//                     
//                     ctx.beginPath();  
//                     
//                     if(dIndex.point != 0)
//                     {
//                         ctx.moveTo(this.s(this.data.currentDrawing.strokes[dIndex.line].points[dIndex.point-1].x,'x'),
//                                    this.s(this.data.currentDrawing.strokes[dIndex.line].points[dIndex.point-1].y,'y'));
//                      ctx.lineTo(this.s(this.data.currentDrawing.strokes[dIndex.line].points[dIndex.point].x,'x'),
//                                this.s(this.data.currentDrawing.strokes[dIndex.line].points[dIndex.point].y,'y'));
//                     }
//                     else
//                     {
//                         
//                     
//                     ctx.moveTo(this.s(this.data.currentDrawing.strokes[dIndex.line].points[dIndex.point].x,'x'),
//                                this.s(this.data.currentDrawing.strokes[dIndex.line].points[dIndex.point].y,'y'));
//                     }
//                 }
//                 // last point
//                 else if(i==this.drawIndex) // Last point
//                 {
// //                     console.error("End Iteration");
// 
//                     ctx.lineTo(this.s(this.data.currentDrawing.strokes[dIndex.line].points[dIndex.point].x,'x'),
//                                this.s(this.data.currentDrawing.strokes[dIndex.line].points[dIndex.point].y,'y'));
//                      ctx.lineCap = 'round';ctx.lineJoin = 'round';
//                     ctx.stroke();
//                 }
//                 else
//                 {
//                     ctx.lineTo(this.s(this.data.currentDrawing.strokes[dIndex.line].points[dIndex.point].x,'x'),
//                                this.s(this.data.currentDrawing.strokes[dIndex.line].points[dIndex.point].y,'y'));
//                 }
// 
//                 dIndex.point++;
//             }
//            ctx.restore();    

    draw:function(ctx)
    {
        var t = (new Date()).getTime()-this.startTime.getTime()-4000;
                //console.error(".");
        this.needRedraw = true;

        if(this.isReady && !this.finished && !this.aborted)
        {
           
           this.beginCanvasMask(ctx);
           
           if(!this.init && this.data.currentDrawing.backgroundColor!=='null' || mainGrid.crossfading)
           {
               
               ctx.fillStyle='#'+this.data.currentDrawing.backgroundColor;
               ctx.fillRect(this.left,this.top,this.width,this.height);
               
//                if(this.drawIndex == )
//                {
                  if(!mainGrid.crossfading)
                      this.init = true;
                  
//                }
           }
           
           var drawSpeed = this.drawSize/this.drawDuration;
           this.drawTarget = Math.floor(t*drawSpeed)
                    
//             console.error(this.drawIndex);
           if(!mainGrid.crossfading && t > 0)
            for(var i=this.drawIndex;i<this.drawTarget && !this.finished;i++)
            {
                // If new line 
                if(this.dIndex.point == this.data.currentDrawing.strokes[this.dIndex.line].points.length)
                {      
//                     console.error("New line");
                    
                    ctx.lineCap = 'round';ctx.lineJoin = 'round';
                    ctx.stroke();
                 
                    this.dIndex.line++;
                    this.dIndex.point = 0;
                    
                    if(this.dIndex.line == this.data.currentDrawing.strokes.length)
                    {
//                         console.log(this.data.currentDrawing);
                           MediaServer.requestMedia('http://'+configOptions.contentServerIp+':'+configOptions.contentServerPort+'/drawing?id='+this.data.currentDrawing._id+'&sentOnce=1',function(data){},function(error,code){});
                           this.finished        = true;
                           this.needRedraw      = false;
                           break;
                    }

                    ctx.strokeStyle='#'+this.data.currentDrawing.strokes[this.dIndex.line].color;
                    ctx.lineWidth=parseInt(this.data.currentDrawing.strokes[this.dIndex.line].lineWidth*this.scaleRatio);
                    
                    ctx.beginPath();                        
                    ctx.moveTo(this.s(this.data.currentDrawing.strokes[this.dIndex.line].points[this.dIndex.point].x,'x'),
                               this.s(this.data.currentDrawing.strokes[this.dIndex.line].points[this.dIndex.point].y,'y'));
                    
                }
                // If beginning
                else if(i == this.drawIndex)
                {
//                     console.error("Begin Iteration");

                    ctx.strokeStyle='#'+this.data.currentDrawing.strokes[this.dIndex.line].color;
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
                else if(i==this.drawTarget-1) // Last point
                {
//                     console.error("End Iteration");

                    ctx.lineTo(this.s(this.data.currentDrawing.strokes[this.dIndex.line].points[this.dIndex.point].x,'x'),
                               this.s(this.data.currentDrawing.strokes[this.dIndex.line].points[this.dIndex.point].y,'y'));
                     ctx.lineCap = 'round';ctx.lineJoin = 'round';
                    ctx.stroke();
                }
                else
                {
                    ctx.lineTo(this.s(this.data.currentDrawing.strokes[this.dIndex.line].points[this.dIndex.point].x,'x'),
                               this.s(this.data.currentDrawing.strokes[this.dIndex.line].points[this.dIndex.point].y,'y'));
                }

                this.dIndex.point++;
                this.drawIndex++;
            }
            
           this.endCanvasMask(ctx);
        }

    },
    load:function(callback)
    {
        this.dIndex = {line:0,point:0};
        var that        = this;
        
        this.requestId = MediaServer.requestMedia(
            'http://'+configOptions.contentServerIp+':'+configOptions.contentServerPort+'/drawing?type='+that.data.type,
            function(data)
            {
                    console.log("[Drawing] Init ");

                    try
                    {
                        that.data.currentDrawing               = JSON.parse(data);
                    }
                    catch(e)
                    {
                        console.log("[Drawing] Error, ignoring this one");
                        
                        setTimeout(function(){that.load()},that.data.timeout*1000);
                        return;
                    }
//                     console.error( that.data.currentDrawing);
                   // Taken from static image 
                    
                    var imgFormat       = that.data.currentDrawing.width/that.data.currentDrawing.height;
                    var drawFormat      = that.width/that.height;
                    
                    that.drawSize       = that.dara.currentDrawing.points
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
                    
                    setTimeout(function(){that.load()},that.data.timeout*1000);
            },
            function(error,code){
                    console.log("[Drawing] error "+code+":"+error);
                    setTimeout(function(){that.load()},that.data.timeout*1000);
                    return;
            }
        );
    },
    cleanup:function()
    {
        this.aborted = true;
        
        if(!this.isReady)
            MediaServer.abort(this.requestId);
   }
};
