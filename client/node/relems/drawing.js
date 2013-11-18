exports.class = {
    type        :'Drawing',
    drawIndex   :0,
    nbIterations:500,
    isReady     :false,
    finished    :false,
    init        :false,
    s           :function(n,what)
    {
           return n*this.scaleRatio + (what == 'x' ? this.offsetX+this.left : this.offsetY+this.top);
    },
    draw:function(ctx)
    {
        if(this.isReady && !this.finished && !this.aborted)
        {
           if(!this.init && this.data.backgroundColor!=='null')
           {
               ctx.fillStyle='#'+this.data.backgroundColor;
               ctx.fillRect(this.left,this.top,this.width,this.height);
               this.init = true; 
           }
           
            for(var i=this.drawIndex;i<this.drawIndex+this.drawSize && !this.finished;i++)
            {
                // If new line 
                
                if(this.dIndex.point == this.data.strokes[this.dIndex.line].points.length)
                {      
//                     console.log("New line");
                     ctx.lineCap = 'round';ctx.lineJoin = 'round';
                    ctx.stroke();
                 
                    this.dIndex.line++;
                    this.dIndex.point = 0;
                    
                    if(this.dIndex.line == this.data.strokes.length)
                    {
                           this.finished = true;
                           break;
                    }

                    ctx.strokeStyle='#'+this.data.strokes[this.dIndex.line].color;
                    ctx.lineWidth=parseInt(this.data.strokes[this.dIndex.line].lineWidth*this.scaleRatio);
                    
                    ctx.beginPath();                        
                    ctx.moveTo(this.s(this.data.strokes[this.dIndex.line].points[this.dIndex.point].x,'x'),
                               this.s(this.data.strokes[this.dIndex.line].points[this.dIndex.point].y,'y'));
                    
                }
                // If beginning
                else if(i == this.drawIndex)
                {
//                     console.log("Begin Iteration");



                    ctx.strokeStyle='#'+this.data.strokes[this.dIndex.line].color;
                    ctx.lineWidth=parseInt(this.data.strokes[this.dIndex.line].lineWidth*this.scaleRatio);
                    
                    ctx.beginPath();  
                    
                    if(this.dIndex.point != 0)
                    {
                        ctx.moveTo(this.s(this.data.strokes[this.dIndex.line].points[this.dIndex.point-1].x,'x'),
                                   this.s(this.data.strokes[this.dIndex.line].points[this.dIndex.point-1].y,'y'));
                     ctx.lineTo(this.s(this.data.strokes[this.dIndex.line].points[this.dIndex.point].x,'x'),
                               this.s(this.data.strokes[this.dIndex.line].points[this.dIndex.point].y,'y'));
                    }
                    else
                    {
                        
                    
                    ctx.moveTo(this.s(this.data.strokes[this.dIndex.line].points[this.dIndex.point].x,'x'),
                               this.s(this.data.strokes[this.dIndex.line].points[this.dIndex.point].y,'y'));
                    }
                }
                // last point
                else if(i==this.drawIndex+this.drawSize-1) // Last point
                {
//                     console.log("End Iteration");

                    ctx.lineTo(this.s(this.data.strokes[this.dIndex.line].points[this.dIndex.point].x,'x'),
                               this.s(this.data.strokes[this.dIndex.line].points[this.dIndex.point].y,'y'));
                     ctx.lineCap = 'round';ctx.lineJoin = 'round';
                    ctx.stroke();
                }
                else
                {
                    ctx.lineTo(this.s(this.data.strokes[this.dIndex.line].points[this.dIndex.point].x,'x'),
                               this.s(this.data.strokes[this.dIndex.line].points[this.dIndex.point].y,'y'));
                }

                this.dIndex.point++;
            }
                this.drawIndex+=this.drawSize;

        }
    },
    load:function(callback)
    {
        this.dIndex = {line:0,point:0};
        var that        = this;
        var http        = require('http');
        var url         = require('url');
        
        var urlObj      = url.parse('http://server:3000/drawing/');
        
        var options = {
          hostname      : urlObj.hostname,
          port          : urlObj.port,
          path          : urlObj.pathname,
          method        : 'GET',
          encoding      : null
        };
              
        this.req = http.request(options, function(res) {
            
            var data = new String();

            res.on('data', function (chunk) 
            {
                data +=chunk;  
            });
          
            res.on('end',function()
            {  
                if(res.statusCode != 200)
                { 
                    console.log("[Drawing] error "+res.statusCode);
                    mainGrid.removeRelem(that);
                    return;
                }
                    
                if(!that.aborted)
                {
                    that.data               = JSON.parse(data);

                    
                   // Taken from static image 
                    
                    var imgFormat       = that.data.width/that.data.height;
                    var drawFormat      = that.width/that.height;
                    
                    that.drawSize       = Math.round(that.data.points/that.nbIterations)+1;
                    
//                         that.imgClipLeft        = 0;
//                         that.imgClipTop         = 0;
//                         that.imgClipHeight      = that.data.height;
//                         that.imgClipWidth       = that.data.width;
                        
                        if(imgFormat > drawFormat) // The image is more landscape
                        {
                            that.offsetX            = 0;
//                             that.ctxClipWidth       = that.width;
                            
                            that.scaleRatio         = that.width/that.data.width;
                            
//                             that.ctxClipHeight      = that.data.width*scaleRatio;
                            that.offsetY            = (that.height-that.data.height*that.scaleRatio)/2;
                          
                        }
                        else // The image is more portrait
                        {
                            that.offsetY         = 0;
//                             that.ctxClipHeight      = that.width;
                            
                            that.scaleRatio          = that.height/that.data.height;
                            
//                             that.ctxClipWidth       = that.data.height*scaleRatio;
                            that.offsetX        = (that.width-that.data.width*that.scaleRatio)/2;
                        }
                    
                    
                    that.isReady            = true;
                    callback();
                }
            });
        });

        this.req.on('error', function(e) {
          console.log("[Drawing] error "+e);
          mainGrid.removeRelem(that);
        });
        
        this.req.setMaxListeners(0);
        this.req.end(); 

    },
    cleanup:function()
    {
        this.aborted = true;
        
        if(!this.ready)
            this.req.abort();
   }
};