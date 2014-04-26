exports.class = { 
    type        :'TimeDisplayer',
    offset      :0,
    lastDate    :{},
    draw        :function(ctx)
    {

            var date = new Date();
            this.textLines          = [('0'+date.getHours()).slice(-2)+':'+('0'  + date.getMinutes()).slice(-2)]; // Don't catch double new lines
            /*
             * Computing optimal font size
             */
            if(!this.fixedFontHeight)
            {
                do
                {
                    this.fontHeight         -= this.fontHeight > 30 ? 3 : 1;
                    this.lineHeight         = this.fontHeight*1.5;

                    ctx.font                =  this.fontHeight+'px ' + this.data.font; 
                    this.maxTextwidth       = 0;
                    
                    for(var i=0;i<this.textLines.length;i++)
                    {
                        if(!this.textLines[i] || this.textLines[i].length == 0)
                            continue;
                
                        var measure                 = ctx.measureText(this.textLines[i]);
                        var thisLineWidth           = measure.width;
                        this.maxTextwidth           = (this.maxTextwidth < thisLineWidth) ? thisLineWidth : this.maxTextwidth;
                        this.textLinesWidth[i]      = thisLineWidth;
                    }
                    
                }
                /*
                 * Loop while not fitting in width OR height
                 */
                while(this.maxTextwidth > 95/100*this.width || this.lineHeight*this.textLines.length > 95/100*this.height);

                this.isReady = true;
                /*
                 * Computing each line position
                 */
                if(!this.data.align)
                    this.data.align = 'center';
                
                for(var i=0;i<this.textLines.length;i++)
                {
                    if(this.data.align == 'center')
                        this.textLinesLeft[i]   = Math.floor((this.width-this.textLinesWidth[i])/2);
                    else if(this.data.align == 'right')
                        this.textLinesLeft[i]   = Math.floor((this.width-this.textLinesWidth[i]));
                    else
                        this.textLinesLeft[i]   = 0;


                    this.textLinesTop[i]    = this.lineHeight*(i+1);

                }
                this.fixedFontHeight        = true;
                this.textTopOffset          = Math.round((this.height-(this.textLines.length*(this.lineHeight)+0.5*this.fontHeight))/2);
            }
            else
                ctx.font                =  this.fontHeight+'px ' + this.data.font;   
 
            
            ctx.save();
       
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
            
            ctx.globalAlpha = 1;
            ctx.fillStyle='#'+this.data.color;

            for(var i = 0;i<this.textLines.length;i++)
            {
                if(!this.textLines[i] || this.textLines[i].length == 0)
                    continue;
                
                ctx.fillText(this.textLines[i],this.textLinesLeft[i],this.textLinesTop[i]+this.textTopOffset);
            }
            ctx.restore();
            

            this.lastDate = date;
        
        
    },
    isReady:false,
    load:function(callback)
    {        
        var that = this;
        this.fontHeight         = this.height*6/10;
        this.lineHeight         = this.height*7/10;
        this.textLinesWidth     = [0];
        this.textLinesLeft      = [0];
        this.textLinesTop       = [0];
        this.isReady            = true;
        this.lastDate           = new Date();
        
        setInterval(function(){
            if(that.lastDate.getMinutes() != (new Date()).getMinutes())
                that.needRedraw = true;
        },5000);
        
       that.needRedraw = true;
        
        callback();
    }
};
