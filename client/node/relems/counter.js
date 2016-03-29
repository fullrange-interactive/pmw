exports.class = { 
  type        :'Counter',
  offset      :0,
  draw        :function(ctx)
  {
    //         console.log("**[relem.counter] Draw. Flipped:"+this.data.flipped);

    var remainingTime       = Array();

    this.now                = new Date();
    var newDate             = new Date(this.now.getFullYear(),this.now.getMonth(),this.now.getDate(),this.nextEvent.getHours(),this.nextEvent.getMinutes());
    var totSeconds          = Math.floor((newDate.getTime()-this.now.getTime())/1000);
        
    if(totSeconds<0)
      totSeconds = 0;
        
    remainingTime.push(new String(totSeconds%60));
    totSeconds /= 60;
    remainingTime.push(new String(Math.floor(totSeconds)%60));
    totSeconds /= 60;
    remainingTime.push(new String(Math.floor(totSeconds)%24));
        

    ctx.fillStyle   = '#'+this.data.color;
    ctx.font        = this.fontHeight+"px DejaVuSans";
        
    /*
    * Measure once
    */
    if(!this.knownDigitWidth)
    {
      var digitWidth      = ctx.measureText("00").width;
      ctx.font            = Math.floor(this.height*0.15)+"px DejaVuSans";

      //             console.log(JSON.stringify(this.cellPositions));
            
      for(var i=1;i<=this.cellPositions.length;i++)
      {
        //                             console.log(this.cellPositions.length-i);

        this.digitMeasures[i-1] = {};
        this.digitMeasures[i-1].digitLeft      = this.cellPositions[this.cellPositions.length-i].x+(this.cellDimensions[i-1].x-digitWidth)/2;
        this.digitMeasures[i-1].labelLeft      = this.cellPositions[this.cellPositions.length-i].x+(this.cellDimensions[i-1].x-ctx.measureText(this.digitLabels[i-1]).width)/2;
                
      }
            
      this.knownDigitWidth = true;
    }
        

    this.isReady = true;

    for(var i=1;i<=this.cellPositions.length;i++)
    {
      ctx.font        = Math.floor(this.fontHeight)+"px DejaVuSans";

      if(this.data.flipped)
      {
        //                 console.log("Draw flipped");
        ctx.save();

        ctx.translate(this.left+this.width,this.top);
        ctx.scale(-1,1);
        ctx.fillText(
          remainingTime[i-1].length == 2 ? remainingTime[i-1] : '0'+remainingTime[i-1],
          this.digitMeasures[i-1].digitLeft-this.left,
          this.cellPositions[this.cellPositions.length-i].y-this.top+this.lineHeight);
          ctx.font        = Math.floor(this.height*0.15)+"px DejaVuSans";
          ctx.fillText(
            this.digitLabels[i-1],
            this.digitMeasures[i-1].labelLeft-this.left,
            this.cellPositions[this.cellPositions.length-i].y-this.top+this.lineHeight+this.height*0.15+15);
            ctx.restore();
          }
          else
          {
            //                 console.log("Draw normal");
            ctx.fillText(
              remainingTime[i-1].length == 2 ? remainingTime[i-1] : '0'+remainingTime[i-1],
              this.digitMeasures[i-1].digitLeft,
              this.cellPositions[this.cellPositions.length-i].y+this.lineHeight);
              ctx.font        = Math.floor(this.height*0.15)+"px DejaVuSans";
              ctx.fillText(
                this.digitLabels[i-1],
                this.digitMeasures[i-1].labelLeft,
                this.cellPositions[this.cellPositions.length-i].y+this.lineHeight+this.height*0.15+15);

              }
            }
       
        
          },
          isReady:false,
          load:function(callback)
          {
            this.cellPositions      = new Array();
            this.cellDimensions     = new Array();
            this.digitMeasures      = new Array();
            this.digitLabels        = new Array('secondes','minutes','heures');
        
            this.fontHeight         = this.height*6/10;
            this.lineHeight         = this.height*7/10;
            this.data.date          = parseInt(this.data.date);
        
            this.now                = new Date();
            this.nextEvent          = new Date(parseInt(this.data.date));
        
            this.data.flipped       = parseBool(this.data.flipped);
  
            //         this.nextEvent.setFullYear(this.now.getFullYear());
            //         this.nextEvent.setMonth(this.now.getMonth());
            //         this.nextEvent.setDate(this.now.getDate());
          
            for(var i in this.cellList)
            {
              if(mainGrid.relemGrid[this.cellList[i].x][this.cellList[i].y].dimensions.x < 40)
                continue;
            
              this.cellPositions.push(mainGrid.relemGrid[this.cellList[i].x][this.cellList[i].y].positions);
              this.cellDimensions.push(mainGrid.relemGrid[this.cellList[i].x][this.cellList[i].y].dimensions);
            
              if(this.cellPositions.length == 3)
                break;
            }
            //         console.log("**[relem.counter] Added "+this.cellPositions.length+" cells to array");
            this.isReady = true;
        
            var that = this;
        
            setInterval(function(){that.needRedraw = true;},1000);
        
            callback();
          }
        };
