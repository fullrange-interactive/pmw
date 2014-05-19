exports.class = { 
    type:'Strobe',
    currentColor:null,
    timeoutHandle:false,
	needRedraw:true,
	opaque:true,
    draw:function(ctx)
    {
		this.needRedraw = true;
		var current = (new Date()).getTime()-this.startTime.getTime();
		var normalized = (current % this.data.speed) / this.data.speed;
		this.currentColor = (normalized > 0.5)?this.data.shadowColor:this.data.color;
        ctx.globalAlpha = 1;
        ctx.fillStyle='#'+this.currentColor;
        ctx.fillRect(this.left,this.top,this.width,this.height);
        ctx.globalAlpha = 1;
    },
    drawZone:function(ctx,x,y,width,height)
    {
        ctx.globalAlpha = 1;
        ctx.fillStyle='#'+this.currentColor;
        ctx.fillRect(x,y,width,height);
        ctx.globalAlpha = 1;
    },
    load:function(callback){
        var that = this;
        
		this.currentColor = this.data.color;
        
        this.isReady = true;
        
        callback();
    },
    cleanup:function()
    {
        if(timeoutHandle)
            clearTimeout(timeoutHandle);
    }
};