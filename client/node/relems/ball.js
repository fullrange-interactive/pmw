exports.class = { 
    type        :'Ball',
    centerX     :-100,
    centerY     :-100,
    radius      :0,
    speedX      :0,
    speedY      :0,
    ball        :false,
    isReady     :false,
    isBallInZone:function()
    {
        return true;
    },
    draw        :function(ctx)
    {
//       console.log(".");
      
      if(!this.ball)
          return;
      
//       console.log("+ ["+this.centerX+":"+this.centerY+"]["+this.speedX+":"+this.speedY+"]");
      ctx.fillStyle='#000000';
      ctx.fillRect(this.left,this.top,this.width,this.height);
      ctx.beginPath();
      ctx.arc(this.centerX, this.centerY,30, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'red';
      ctx.fill();
      
      this.centerX      += this.speedX;
      this.centerY      += this.speedY;
      
      /*
       * Leaving screen from right
       */
      if(this.centerX > mainGrid.wrapper.base.x+mainGrid.wrapper.width+1 && this.hasRightNeighbor)
      {
          ipcServer.notifyNeighbor(
              mainGrid.windowPositionX+1,
              mainGrid.windowPositionY,
              this.z,
              this.type,
              {
                  x     :this.centerX,
                  y     :this.centerY,
                  vx    :this.speedX,
                  vy    :this.speedY,
                  from  :'left'
              });
          
          this.ball   = false;
      ctx.fillStyle='#000000';
      ctx.fillRect(this.left,this.top,this.width,this.height);
          this.needRedraw = false;
          console.log("[relem.ball] Notify right");

          return;
      }
      else if(this.centerX > mainGrid.wrapper.base.x+mainGrid.wrapper.width+1)
          this.speedX *= -1;
      /*
       * From left
       */
      if(this.centerX < mainGrid.wrapper.base.x-1 && this.hasLeftNeighbor)
      {
          ipcServer.notifyNeighbor(
              mainGrid.windowPositionX-1,
              mainGrid.windowPositionY,
              this.z,
              this.type,
              {
                  x     :this.centerX,
                  y     :this.centerY,
                  vx    :this.speedX,
                  vy    :this.speedY,
                  from  :'right'
              });
                         this.ball   = false;

          this.needRedraw = false;
          console.log("[relem.ball] Notify left");
      ctx.fillStyle='#000000';
      ctx.fillRect(this.left,this.top,this.width,this.height);
      return;
      }
      else if(this.centerX < mainGrid.wrapper.base.x-1)
          this.speedX *= -1;
      /*
       * From bottom
       */
//       console.log("****************** "+this.centerY+" > "+(mainGrid.wrapper.base.y+mainGrid.wrapper.height)+" ************************");
      
      if(this.centerY > mainGrid.wrapper.base.y+mainGrid.wrapper.height+1 && this.hasBottomNeighbor)
      {
          ipcServer.notifyNeighbor(
              mainGrid.windowPositionX,
              mainGrid.windowPositionY+1,
              this.z,
              this.type,
              {
                  x     :this.centerX,
                  y     :this.centerY,
                  vx    :this.speedX,
                  vy    :this.speedY,
                  from  :'top'
              });
                         this.ball   = false;

          this.needRedraw = false;
          console.log("[relem.ball] Notify bottom");
      ctx.fillStyle='#000000';
      ctx.fillRect(this.left,this.top,this.width,this.height);
          return;
      }
      else if(this.centerY > mainGrid.wrapper.base.y+mainGrid.wrapper.height+1)
          this.speedY *= -1;

      /*
       * From top
       */
      if(this.centerY < mainGrid.wrapper.base.x-1 && this.hasTopNeighbor)
      {
          ipcServer.notifyNeighbor(
              mainGrid.windowPositionX,
              mainGrid.windowPositionY-1,
              this.z,
              this.type,
              {
                  x     :this.centerX,
                  y     :this.centerY,
                  vx    :this.speedX,
                  vy    :this.speedY,
                  from  :'bottom'
              });
          
          this.needRedraw = false;
      ctx.fillStyle='#000000';
      ctx.fillRect(this.left,this.top,this.width,this.height);
          console.log("[relem.ball][Notify] Notify top");
               this.ball   = false;

          return;
      }
      else if(this.centerY < mainGrid.wrapper.base.x-1)
          this.speedY *= -1;
      
//       context.lineWidth = 0;
//       context.strokeStyle = '#003300';
//       context.stroke();
      
      
/*        
        ctx.fillStyle='#'+this.data.color;
        ctx.fillRect(this.left,this.top,this.width,this.height);
        ctx.globalAlpha = 1;*/
        this.needRedraw = true;
    },
    load        :function(callback){
        
        var that = this;
        
        this.centerX = this.left+this.width/2;
        this.centerY = this.top+this.height/2;
        
//         console.log("[relem.ball][load] Load");
        
        console.log("[relem.ball][ipcCallback] Registered callback");
        
        ipcServer.registerCallback(this.z,this.type,function(message){
            
//             console.error(message);
            
            console.log("[relem.ball][ipcCallback] Received callback from "+this.z+":"+this.type+" with values {"+message.msg.x+","+message.msg.y+","+message.msg.vx+","+message.msg.vy+"}");
            
            that.ball   = true;

            message             = message.msg;
             
            that.centerX        = message.x;
            that.centerY        = message.y;
            that.speedX         = message.vx;
            that.speedY         = message.vy;
                      
             if(message.from == 'top')
             {
                 that.centerY = mainGrid.wrapper.base.x;
                 console.log("[relem.ball][ipcCallback] Message from top");
             }
             else if(message.from == 'right')
             {
                 that.centerX = mainGrid.wrapper.base.x+mainGrid.wrapper.width;
                 console.log("[relem.ball][ipcCallback] Message from right");
             }
             else if(message.from == 'bottom')
             {
                 that.centerY = mainGrid.wrapper.base.y+mainGrid.wrapper.height;
                 console.log("[relem.ball][ipcCallback] Message from bottom");
             }
             else if(message.from == 'left')
             {
                 that.centerX = mainGrid.wrapper.base.y;
                 console.log("[relem.ball][ipcCallback] Message from left");
             }

             console.log("[relem.ball][ipcCallback] Init ball position "+that.centerX+":"+that.centerY+","+that.speedX+":"+that.speedY);

             that.ball = true;
             that.needRedraw = true;
        });

        this.hasLeftNeighbor     = this.localBaseX      < 0;
        this.hasTopNeighbor      = this.localBaseY      < 0;
        this.hasRightNeighbor    = this.localEndX       > mainGrid.gridSizeX;
        this.hasBottomNeighbor   = this.localEndY       > mainGrid.gridSizeY;
        
        console.log("[relem.ball][load] Neighbors: top:"+this.hasTopNeighbor+" right:"+this.hasRightNeighbor+" bottom:"+this.hasBottomNeighbor+" left:"+this.hasLeftNeighbor );
        
        if(this.windowStartX == 0 && this.windowStartY == 0)
        {
               console.log("[relem.ball][load] I'm the master");
               
               this.ball   = true;

               this.speedX = 5;
               this.speedY = 6;
                   
               this.centerX = this.left+this.radius/2;
               this.centerY = this.top+this.radius/2;
        }
        
        this.isReady = true;
        
        callback();
    }
};