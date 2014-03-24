exports.class = {
    type:'Marquee',
    offset:0,
    opaque:false,
    isReady:false,
    needRedraw:true,
    draw:function(ctx)
    {
        ctx.save();
        
//         if(this.baseX != 0 || this.endX != iendX)
//         {
            // Clip to allowed drawing zone
            ctx.beginPath();
            ctx.rect(this.left+2,this.top+2,this.width-4,this.height-4); 
            
            // Clip to the current path
            ctx.clip();
//         }
        this.fontHeight         = this.height*6/10;
        this.lineHeight         = this.height*8/10;
        this.data.speed         = parseInt(this.data.speed);
        
        ctx.fillStyle           ='#'+this.data.color;
        ctx.font                =this.fontHeight+'px ' + this.data.font;
        this.textwidth          = ctx.measureText(this.data.text).width;
        
                
        if(this.data.flipped)
        {
            ctx.translate(this.left+this.width,this.top);
            ctx.scale(-1,1);
        }
        else
        {
            ctx.translate(this.left,this.top);
        }
        
        var shadowDistance = parseInt(this.data.shadowDistance);
        
        if(shadowDistance > 0)
        {
            ctx.fillStyle='#'+this.data.shadowColor;
            ctx.fillText(this.data.text,-this.offset+shadowDistance,this.lineHeight+shadowDistance);
        }
        ctx.fillStyle='#'+this.data.color;
        ctx.fillText(this.data.text,-this.offset,this.lineHeight);

        ctx.restore();
         
        this.offset += 40*this.data.speed*((new Date()).getTime()-this.startStamp)/1000;
        this.startStamp = (new Date()).getTime();

        if(this.offset > this.textwidth)
            this.offset = -this.width;
        
        this.needRedraw = true;
    },
    load:function(callback){
        this.offset = -this.width+50;
        this.isReady = true;
        this.data.flipped = parseBool(this.data.flipped);
        this.startStamp = (new Date()).getTime();
        callback();
    }
};