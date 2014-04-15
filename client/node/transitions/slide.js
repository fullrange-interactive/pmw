exports.class = {
    type:'slide',
    forceFullDraw:true,
    speed:2000,
    shift:0,
    afterDraw:function()
    {
        console.log("[transition.slide] BeforeDraw. Shift :"+this.shift)
        this.shift = ((new Date()).getTime() - this.beginning)/this.speed*this.dimensions.width;
        
        var translateX  = Math.round(this.dimensions.base.x-this.dimensions.width+this.shift);
        
        if(translateX > 0)
        {
            console.log("[transition.slide] Finished");
            this.finished = true;
            translateX = 0;
        }
        
        this.ctx.translate(translateX,0);
        this.newRelemsFulldraw();
        this.ctx.translate(-translateX,0);
    }
};
 
