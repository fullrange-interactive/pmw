exports.class = { 
    type:'Color',
    draw:function(ctx)
    {
        ctx.globalAlpha = parseInt(this.data.opacity)/100;
        ctx.fillStyle='#'+this.data.color;
        ctx.fillRect(this.left,this.top,this.width,this.height);
        ctx.globalAlpha = 1;
    },
    drawZone:function(ctx,x,y,width,height)
    {
        ctx.globalAlpha = parseInt(this.data.opacity)/100;
        ctx.fillStyle='#'+this.data.color;
        ctx.fillRect(x,y,width,height);
        ctx.globalAlpha = 1;
    },
    isReady:true,
    load:function(callback){
        callback();
    }
};