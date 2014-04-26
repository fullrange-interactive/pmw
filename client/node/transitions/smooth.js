exports.class = { 
    type:'smooth',
    forceFullDraw:true,
    speed:2000,
    shift:0,
    ax:0,
    vx: 0,
    translateX:0,
    needBlackBackgroundRedraw:true,
    beforeDraw:function()
    {        
        var target = this.dimensions.width;
        this.shift = ((new Date()).getTime() - this.beginning)/this.speed*this.dimensions.width;
        
//         this.vx += 1/(target-this.translateX)*150;
//         this.translateX  += this.vx;
        this.ax = (target-this.translateX)/10 - this.vx*0.3;
        this.vx += this.ax;
        this.translateX  += this.vx;
        
//         console.log("[transition.slide] BeforeDraw. T1 :"+this.translateX);
//         console.log("[transition.slide] BeforeDraw. T2 :"+(this.dimensions.width-this.translateX));
        
        this.ctx.translate(this.translateX-this.dimensions.width,0);
        this.newRelemsFulldraw();
        this.ctx.translate(this.dimensions.width,0);
    },
    afterDraw:function()
    {
        var target = this.dimensions.width;
        this.ctx.translate(-(this.dimensions.width+this.translateX-this.dimensions.width),0);
        
//         console.log("[transition.slide] AfterDraw Shift :"+this.shift);
        if(Math.abs(target - this.translateX) < 3 && Math.abs(this.vx) < 5)
        {
            console.log("[transition.slide] Finished");
            this.finished = true;
            this.translateX = 0;
            this.vx = 0;
        }
    }
};
 