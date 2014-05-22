exports.class = { 
    type:'Color',
    draw:function(ctx)
    {
        var oldAlpha = ctx.globalAlpha;
        ctx.globalAlpha = parseInt(this.data.opacity)/100*oldAlpha;
        ctx.fillStyle='#'+this.data.color;
        ctx.fillRect(this.left,this.top,this.width,this.height);
        ctx.globalAlpha = oldAlpha;
//                         console.log(this.left+","+this.top+","+this.width+","+this.height);

    },
    drawZone:function(ctx,x,y,width,height)
    {
        var oldAlpha = ctx.globalAlpha;
        ctx.globalAlpha = parseInt(this.data.opacity)/100*oldAlpha;
        ctx.fillStyle='#'+this.data.color;
        ctx.fillRect(x,y,width,height);
        ctx.globalAlpha = oldAlpha;
//                         console.log(x+","+y+","+width+","+height);

    },
    isReady:true,
    load:function(callback){
        callback();
    }
};