exports.class = { 
    type:'Flash',
	drawnOnce: false,
	opacity: 1,
	needRedraw: true,
	opaque: false,
	drawStart: null,
    draw:function(ctx)
    {
		ctx.fillStyle='#'+this.data.color;
		if ( !this.drawnOnce && !mainGrid.crossfading ){
			this.drawnOnce = true;
			this.drawStart = (new Date()).getTime();
		}
		if ( this.drawnOnce && this.opacity > 0 ){
			this.opacity = ((new Date()).getTime() - this.drawStart)/this.data.duration;
		}
		if ( this.opacity < 0 ){
			this.opacity = 0;
		}
		//console.log(this.opacity);
		ctx.globalAlpha = this.opacity;
        ctx.fillRect(this.left,this.top,this.width,this.height);
        ctx.globalAlpha = 1;
		this.needRedraw = true;
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