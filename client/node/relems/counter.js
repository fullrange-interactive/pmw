exports.class = {
    type        :'Counter',
    offset      :0,
    draw        :function(ctx)
    {
        var remainingTime       = Array();

        this.now                = new Date();
        var totSeconds          = Math.floor((this.nextEvent.getTime()-this.now.getTime())/1000);
        
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

            for(var i=0;i<3;i++)
            {
                this.digitMeasures[i] = {};
                this.digitMeasures[i].digitLeft      = this.cellPositions[2-i].x+(this.cellDimensions[i].x-digitWidth)/2;
                this.digitMeasures[i].labelLeft      = this.cellPositions[2-i].x+(this.cellDimensions[i].x-ctx.measureText(this.digitLabels[i]).width)/2;
                
            }
            
            this.knownDigitWidth = true;
        }

        ctx.font        = Math.floor(this.fontHeight)+"px DejaVuSans";

        for(var i=0;i<3;i++)
        {
            ctx.save();
                    
            if(this.data.flipped)
            {
                ctx.translate(this.left+this.width,this.top);
                ctx.scale(-1,1);
                ctx.fillText(
                    remainingTime[i].length == 2 ? remainingTime[i] : '0'+remainingTime[i],
                    this.digitMeasures[i].digitLeft-this.left,  this.cellPositions[2-i].y-this.top+this.lineHeight);
                ctx.font        = Math.floor(this.height*0.15)+"px DejaVuSans";
                ctx.fillText(
                    this.digitLabels[i],
                    this.digitMeasures[i].labelLeft-this.left,  this.cellPositions[2-i].y-this.top+this.lineHeight+this.height*0.15+15);
                
            }
            else
            {
                ctx.fillText(
                    remainingTime[i].length == 2 ? remainingTime[i] : '0'+remainingTime[i],
                    this.digitMeasures[i].digitLeft,            this.cellPositions[2-i].y+this.lineHeight);
                ctx.font        = Math.floor(this.height*0.15)+"px DejaVuSans";
                ctx.fillText(
                    this.digitLabels[i],
                    this.digitMeasures[i].labelLeft,            this.cellPositions[2-i].y+this.lineHeight+this.height*0.15+15);

            }
            ctx.restore();
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
  
        this.nextEvent.setFullYear(this.now.getFullYear());
        this.nextEvent.setMonth(this.now.getMonth());
        this.nextEvent.setDate(this.now.getDate());
          
        for(var i in this.cellList)
        {
             this.cellPositions.push(mainGrid.relemGrid[this.cellList[i].x][this.cellList[i].y].positions);
             this.cellDimensions.push(mainGrid.relemGrid[this.cellList[i].x][this.cellList[i].y].dimensions);
        }
        callback();
    }
};
