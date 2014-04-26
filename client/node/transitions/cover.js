exports.class = { 
    type:'cover',
    forceFullDraw:true,
    speed:2000,
    shift:0,
    afterDraw:function()
    {
        this.shift = ((new Date()).getTime() - this.beginning)/this.speed*this.dimensions.width;
        
        var translateX  = Math.round(this.dimensions.base.x-this.dimensions.width+this.shift);

//         console.log("[transition.cover] AfterDraw. Shift :"+this.shift)
        
        if(translateX > 0)
        {
            console.log("[transition.cover] Finished");
            this.finished = true;
            translateX = 0;
        }
        
        this.ctx.translate(translateX,0);
        this.newRelemsFulldraw();
        this.ctx.translate(-translateX,0);
    }
};
 
