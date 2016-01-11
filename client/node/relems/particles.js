exports.class = {
  keyFrames   :false,
  type        :'Particles',
  particles   :false,
  isReady     :false,
  prob        :0.5,
  emitterRadius : 200,
  isFirstDraw :true,
  randomFloat :function(min,max)
  {
    return (Math.random() * (max - min) + min);
  },
  sendParticle:function(destX,destY,particle,from)
  {
    if(particle.sent)
      return
            
    ipcServer.notifyNeighbor(
      mainGrid.windowPositionX + destX,
      mainGrid.windowPositionY + destY,
      this.z,
      this.type,
      {
        x     :particle.x,
        y     :particle.y,
        v     :particle.v,
        angle :particle.angle,
        r     :particle.r,
        color :particle.color,
        ttl   :10000,
        sent  :false,
        from  : from
      });
          
      particle.sent = true;
    },
    draw        :function(ctx)
    {
      if(this.isFirstDraw)
      {    
        this.lastDraw = this.lastSeed = this.lastGB = (new Date()).getTime();
        this.isFirstDraw = false;
      }
      
      var now = (new Date()).getTime();
      
      this.needRedraw = true;

      
      /*
      * Generating particles automaticaly if no keyFrames provided
      */
      if(this.isGenerator)
      {
        if(now - this.lastSeed > 200)
        {
          for(var i = 0;i<=~~this.data.rate/50;i++)
          {
            var angle =  this.randomFloat(-3.14,3.14);
            this.particles.push({
              x          : this.generatorOriginX+Math.cos(angle)*this.emitterRadius,
              y          : this.generatorOriginY+Math.sin(angle)*this.emitterRadius,
              v          : this.randomFloat(200,500)/1000, // px / ms 
              angle      : angle,
              r          : this.randomFloat(5,15),
              color      : '#'+this.data.color,
              ttl        : 10000,
              sent       : false
            });
          }
          this.lastSeed = now;
        }
          
        //           console.log("l"+this.keyFrames.length);
          
        //         console.log("keyFrames:"+this.keyFrames.length);
          
        //           if(this.keyFrames.length > 0)
        //           {
          //               console.log(now+" - "+this.startTime.getTime()+":"+(now-this.startTime.getTime())+"................................"+ this.keyFrames[0].t*1000);
          //           }
          
          if(this.keyFrames.length > 0 && now - this.startTime.getTime() > this.keyFrames[0].t*1000)
          {
            //               console.log(now+" - "+this.startTime.getTime()+":"+(now-this.startTime.getTime())+"*****************************************"+ this.keyFrames[0].t*1000);
            var color = this.keyFrames.shift().color;
              
            for(var i = 0;i<30;i++)
            {
              var angle = this.randomFloat(-3.14,3.14);
              this.particles.push({
                x          : this.generatorOriginX+Math.cos(angle)*this.emitterRadius,
                y          : this.generatorOriginY+Math.sin(angle)*this.emitterRadius,
                v          : 1, // px / ms 
                angle      : angle,
                r          : this.randomFloat(5,15),
                color      : color,
                ttl        : 10000,
                sent       : false
              });
            }
          }
      
        }  
        //           if(this.data.)
          
      
        ctx.globalAlpha       = 0.05;
        ctx.fillStyle         = '#'+this.data.shadowColor;
          
        ctx.fillRect(this.left,this.top,this.width,this.height);
        ctx.globalAlpha       = 1;
      
        for(var i in this.particles)
        {
          //           console.log(".");

          var particle          = this.particles[i];
          var oldGlobalAlpha    = ctx.globalAlpha;
          
          ctx.beginPath();
          ctx.arc(particle.x,particle.y,particle.r, 0, 2 * Math.PI, false);
          ctx.fillStyle         = particle.color;
          ctx.fill();
          
          particle.x += (now-this.lastDraw)*Math.cos(particle.angle)*particle.v;
          particle.y += (now-this.lastDraw)*Math.sin(particle.angle)*particle.v;
          particle.ttl--;

          /*
          * Leaving screen from rightTop
          */
          if(particle.x > mainGrid.wrapper.base.x+mainGrid.wrapper.width &&
            particle.y < mainGrid.wrapper.base.y)

            {    
              if(this.hasRightTopNeighbor)
                this.sendParticle(1,-1,particle,'bottomLeft');
              
              particle.ttl = 0;
              continue;
            }
          
            /*
            * Leaving screen from rightBottom
            */
            if(
              particle.x > mainGrid.wrapper.base.x+mainGrid.wrapper.width &&
              particle.y > mainGrid.wrapper.base.y+mainGrid.wrapper.height
            )
            {    
              if(this.hasRightBottomNeighbor)
                this.sendParticle(1,1,particle,'topLeft');

              particle.ttl = 0;
              continue;
            }
          
            /*
            * Leaving screen from leftBottom
            */
            if(particle.x < mainGrid.wrapper.base.x &&
              particle.y > mainGrid.wrapper.base.y+mainGrid.wrapper.height)
              {    
                if(this.hasLeftBottomNeighbor)
                  this.sendParticle(-1,1,particle,'topRight');

                particle.ttl = 0;
                continue;
              }
          
              /*
              * Leaving screen from leftTop
              */
              if(particle.x < mainGrid.wrapper.base.x &&
                particle.y < mainGrid.wrapper.base.y)
                {    
                  if(this.hasleftTopNeighbor)
                    this.sendParticle(-1,-1,particle,'bottomRight');
 
                  particle.ttl = 0;
                  continue;
                }
          
                /*
                * Leaving screen from right
                */
                if(particle.x > mainGrid.wrapper.base.x+mainGrid.wrapper.width)
                {    
                  if(this.hasRightNeighbor)
                    this.sendParticle(1,0,particle,'left');

                  particle.ttl = 0;
                  continue;
                }
                /*
                * From left
                */
                if(particle.x < mainGrid.wrapper.base.x)
                {
                  if(this.hasLeftNeighbor)
                    this.sendParticle(-1,0,particle,'right');
              
                  particle.ttl = 0;
                  continue;
                }

                /*
                * From bottom
                */   
                if(particle.y > mainGrid.wrapper.base.y+mainGrid.wrapper.height)
                {
                  if(this.hasBottomNeighbor)
                    this.sendParticle(0,1,particle,'top');
              
                  particle.ttl = 0;
                  continue;
                }

                /*
                * From top
                */
                if(particle.y < mainGrid.wrapper.base.y)
                {
                  if(this.hasTopNeighbor)
                    this.sendParticle(0,-1,particle,'bottom');

                  particle.ttl = 0;
                  continue;
                }
              }
      
              this.particles = this.particles.filter(function(e){return e.ttl > 0 && !e.sent});

              this.lastDraw = now; 
            },
            load : function(callback){
        
              var that = this;
        
              console.log("[relem.particles][ipcCallback] Registered callback");
        
              this.callbackId = ipcServer.registerCallback(
                this.z,
                this.type,
                function(message)
                {   
                  var particle = message.msg;
                
                  if(particle.from == 'top' || particle.from == 'topLeft' || particle.from == 'topRight') 
                    particle.y = mainGrid.wrapper.base.y;
                
                  if(particle.from == 'bottom' || particle.from == 'bottomLeft' || particle.from == 'bottomRight') // 
                    particle.y = mainGrid.wrapper.base.y+mainGrid.wrapper.height;
                
                  if(particle.from == 'left' || particle.from == 'topLeft' || particle.from == 'bottomLeft') 
                    particle.x = mainGrid.wrapper.base.x;
                
                  if(particle.from == 'right' || particle.from == 'topRight' || particle.from == 'bottomRight') 
                    particle.x = mainGrid.wrapper.base.x+mainGrid.wrapper.width;
                
                  console.log("[relem.particles][ipcCallback] Received: ["+particle.x+":"+particle.y+"] From "+particle.from);

                  that.particles.push(particle);
                  that.needRedraw = true;                
                });
        
                this.generatorOriginX = this.left+this.width/2;
                this.generatorOriginY = this.top+this.height/2;
        
                if(
                  this.generatorOriginX > 0                         &&
                  this.generatorOriginX < mainGrid.wrapper.width    && 
                  this.generatorOriginY > 0                         &&
                  this.generatorOriginY < mainGrid.wrapper.height
                )
                {
                  console.log("[relem.particles][load] I'm the supervisor, gimme the taxi number");
                  this.isGenerator = true;
                }
        
                this.keyFrames = [{t:7.696, color:'#e5287b'},{t:9.572, color:'#07ace2'},{t:11.448, color:'#94c13c'},{t:12.619, color:'#e5287b'},{t:12.978, color:'#94c13c'},{t:13.324, color:'#e5287b'},{t:14.018, color:'#e5287b'},{t:14.974, color:'#07ace2'}];
        
                //         console.log("keyFrames:"+this.keyFrames.length);
        
                this.isReady    = true;
                this.particles  = new Array();
        
                callback();
              },
              cleanup:function()
              {
                if(this.isReady)
                  ipcServer.deregisterCallback(this.callbackId);
              }
            };