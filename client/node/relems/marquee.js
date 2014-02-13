exports.class = {
    type:'Marquee',
    offset:0,
    opaque:false,
    draw:function(ctx)
    {
        this.fontHeight         = this.height*6/10;
        this.lineHeight         = this.height*8/10;
        this.data.speed         = parseInt(this.data.speed);
        
        ctx.fillStyle           ='#'+this.data.color;
        ctx.font                =this.fontHeight+'px ' + this.data.font;
        this.textwidth          = ctx.measureText(this.data.text).width;
        
        this.beginCanvasMask(ctx);
        
        ctx.save();
        if(this.data.flipped)
        {
            ctx.translate(this.left+this.width,this.top);
            ctx.scale(-1,1);
        }
        else
            ctx.translate(this.left,this.top);
        
        var shadowDistance = parseInt(this.data.shadowDistance);
        
        if(shadowDistance > 0)
        {
            ctx.fillStyle='#'+this.data.shadowColor;
            ctx.fillText(this.data.text,-this.offset+shadowDistance,this.lineHeight+shadowDistance);
        }
        ctx.fillStyle='#'+this.data.color;
        ctx.fillText(this.data.text,-this.offset,this.lineHeight);
            
        ctx.restore();

        this.endCanvasMask(ctx);
        
        this.offset += this.data.speed*2;
        
        if(this.offset > this.textwidth)
            this.offset = -this.width;
        
        this.needRedraw = true;
    },
    isReady:false,
    needRedraw:true,
    load:function(callback){
        this.offset = -this.width+50;
        this.isReady = true;
        this.data.flipped = parseBool(this.data.flipped);
        callback();
    }
};