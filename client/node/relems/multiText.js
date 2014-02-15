exports.class = {
    type        : 'MultiText',
    offset      : 0,
    animationFrames : 2,
    opaque      : false,
    draw        : function(ctx)
    {
            console.log("[relem.multiText] Draw... ");
        /*
         * Computing optimal font size
         */
        if(!this.fixedFontHeight[this.currentTextIndex])
        {
            do
            {
                this.fontHeight[this.currentTextIndex]         -= this.fontHeight[this.currentTextIndex] > 30 ? 3 : 1;
                this.lineHeight         = this.fontHeight[this.currentTextIndex]*1.5;

                ctx.font                =  this.fontHeight[this.currentTextIndex]+'px ' + this.data.font;
                this.maxTextwidth       = 0;
                
                for(var i=0;i<this.textLines[this.currentTextIndex].length;i++)
                {
                    if(!this.textLines[this.currentTextIndex][i] || this.textLines[this.currentTextIndex][i].length == 0)
                        continue;
            
                    var measure                 = ctx.measureText(this.textLines[this.currentTextIndex][i]);
                    var thisLineWidth           = measure.width;
                    this.maxTextwidth           = (this.maxTextwidth < thisLineWidth) ? thisLineWidth : this.maxTextwidth;
                    this.textLinesWidth[this.currentTextIndex][i]      = thisLineWidth;
                }
                
            }
            /*
             * Loop while not fitting in width OR height
             */
            while(this.maxTextwidth > 95/100*this.width || this.lineHeight*this.textLines[this.currentTextIndex].length > 95/100*this.height);

            this.isReady = true;
            /*
             * Computing each line position
             */
            if(!this.data.align)
                this.data.align = 'center';
            
            for(var i=0;i<this.textLines[this.currentTextIndex].length;i++)
            {
                if(this.data.align == 'center')
                    this.textLinesLeft[this.currentTextIndex][i]   = Math.floor((this.width-this.textLinesWidth[this.currentTextIndex][i])/2);
                else if(this.data.align == 'right')
                    this.textLinesLeft[this.currentTextIndex][i]   = Math.floor((this.width-this.textLinesWidth[this.currentTextIndex][i]));
                else
                    this.textLinesLeft[this.currentTextIndex][i]   = 0;

                this.textLinesTop[this.currentTextIndex][i]    = this.lineHeight*(i+1);

            }
            this.fixedFontHeight[this.currentTextIndex]        = true;
            this.textTopOffset[this.currentTextIndex]          = Math.round((this.height-(this.textLines[this.currentTextIndex].length*(this.lineHeight)+0.5*this.fontHeight[this.currentTextIndex]))/2);
        }
        else
            ctx.font                =  this.fontHeight[this.currentTextIndex]+'px ' + this.data.font;  
        
        
        
        if(this.animationIndex >= 0)
        {
            console.log("[relem.multiText] Drawing text ");

            ctx.save();
            ctx.globalAlpha = 1;

            /*
             * Translating to top left corner of the draw zone
             */
            if(this.data.flipped)
            {
                ctx.translate(this.left+this.width,this.top);
                ctx.scale(-1,1);
            }
            else 
                ctx.translate(this.left,this.top);
            
            ctx.fillStyle='#'+this.data.color;

            for(var i = 0;i<this.textLines[this.currentTextIndex].length;i++)
            {
                if(!this.textLines[this.currentTextIndex][i] || this.textLines[this.currentTextIndex][i].length == 0)
                    continue;
             
                ctx.fillText(this.textLines[this.currentTextIndex][i],this.textLinesLeft[this.currentTextIndex][i],this.textLinesTop[this.currentTextIndex][i]+this.textTopOffset[this.currentTextIndex]);
            }
            
            ctx.restore();
        }
        else
        {
            console.log("[relem.multiText] Drawing dim ");

//             ctx.globalAlpha     = 0.1;
//             ctx.fillStyle       = '#000000';
//             ctx.fillRect(this.left,this.top,this.width,this.height);
        }
        
       this.animationIndex++;
       
       if(this.animationIndex < this.animationFrames)
           this.needRedraw = true;
        
          
    },
    isReady     : false,
    updateText  : function()
    {
            console.log("[relem.multiText] New text. Timeout was: "+this.textTimeout[this.currentTextIndex]);
        this.currentTextIndex   = (this.currentTextIndex+1)%this.data.texts.length;
        this.needRedraw         = true;
//         this.fixedFontHeight    = false;
        this.animationIndex     = -this.animationFrames;
        var that = this;
        setTimeout(function(){that.updateText()},this.textTimeout[this.currentTextIndex]*1000)
    },
    load        : function(callback)
    {
//         this.fontHeight         = Math.round(this.height);     // Setting initial font size
//         this.data.speed         = parseInt(this.data.speed);
        this.data.flipped       = parseBool(this.data.flipped);
        
        this.textLines          = new Array();
        this.textTimeout        = new Array();
        
        this.textLinesWidth     = new Array();
        this.textLinesLeft      = new Array();
        this.textLinesTop       = new Array();
        this.textTopOffset      = new Array();
        
        this.fontHeight         = new Array();
        this.fixedFontHeight    = new Array();

        console.log("[relem.multiText] Load");
        
        for(var i in this.data.texts)
        {
            console.log("[relem.multiText] Adding text N°"+i);
            this.textLines.push(this.data.texts[i].text.replace(/\r\n/,'\n').split(/\n/)); // Don't catch double new lines
            this.textTimeout.push(this.data.texts[i].duration);
            this.textLinesWidth.push(new Array());
            this.textLinesLeft.push(new Array());
            this.textLinesTop.push(new Array());
            this.fixedFontHeight.push(false);
            this.fontHeight.push(Math.round(this.height));
        }
        
        this.lineHeight         = this.height;
        
        this.currentTextIndex   = 0;
        this.animationIndex     = 0;
        var that = this;
        
        this.isReady = true;
        console.log("timeout:"+this.textTimeout[this.currentTextIndex]*1000);
        setTimeout(function(){that.updateText()},this.textTimeout[this.currentTextIndex]*1000);
        this.isReady = true;
        callback();
    }
};