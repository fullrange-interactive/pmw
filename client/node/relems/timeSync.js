exports.class = { 
    type:'TimeSync',
    currentColor:'FFFFFF',
    timeoutHandle:false,
    draw:function(ctx)
    {
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
    changeColor:function()
    {
        var that = this;
        
        
        console.log(".");
        if(this.currentColor == 'FFFFFF')
        {
            this.currentColor = '000000';
        }
        else
            this.currentColor = 'FFFFFF';
        
        this.needRedraw = true;
        
        console.log("cg"+(1000-((new Date).getTime())%1000));
        this.timeoutHandle = setTimeout(function(){that.changeColor(that)},(1000-((new Date).getTime())%1000));
    },
    load:function(callback){
        var that = this;
        console.log("cg"+(1000-((new Date).getTime())%1000));
        this.timeoutHandle = setTimeout(function(){
            that.changeColor();
        },(1000-((new Date).getTime())%1000));
        
        this.isReady = true;
        
        callback();
    },
    cleanup:function()
    {
        if(timeoutHandle)
            clearTimeout(timeoutHandle);
    }
};