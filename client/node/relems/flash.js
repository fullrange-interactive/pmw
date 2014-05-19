exports.class = { 
    type:'Flash',
	drawnOnce: false,
	opacity: 1,
	needRedraw: true,
    draw:function(ctx)
    {
		ctx.fillStyle='#'+this.data.color;
		if ( !this.drawnOnce && !mainGrid.crossfading ){
			this.drawnOnce = true;
		}
		if ( this.drawnOnce && this.opacity > 0 ){
			this.opacity -= 0.05;
		}
		ctx.globalAlpha = this.opacity;
        ctx.fillRect(this.left,this.top,this.width,this.height);
        ctx.globalAlpha = 1;
    },
    drawZone:function(ctx,x,y,width,height)
    {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle='#'+this.data.color;
        ctx.fillRect(x,y,width,height);
        ctx.globalAlpha = 1;
    },
    isReady:true,
    load:function(callback){
        callback();
    }
};