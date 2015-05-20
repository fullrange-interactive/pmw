exports.class = { 
    type                        :'smoothLeft',
    forceFullDraw               :true,
    speed                       :2000,
    shift                       :0,
    ax                          :0,
    vx                          :0,
    translateX                  :0,
    needBlackBackgroundRedraw   :true,
    beforeDraw                  :function()
    {        
        var target      = this.dimensions.width;
        this.shift      = ((new Date()).getTime() - this.beginning)/this.speed*this.dimensions.width;
        
        this.ax         = (target-this.translateX)/10 - this.vx*0.3;
        this.vx         += this.ax;
        this.translateX += this.vx;

        this.ctx.translate(this.translateX-this.dimensions.width,0);
        this.newRelemsFulldraw();
        this.ctx.translate(this.dimensions.width,0);
    },
    afterDraw:function()
    {
        var target = this.dimensions.width;
        
        this.ctx.translate(-this.translateX,0);
        if(Math.abs(target - this.translateX) < 3 && Math.abs(this.vx) < 5)
        {
            console.log("[transition.smoothLeft] Finished");
            this.finished = true;
            this.translateX = 0;
            this.vx = 0;
        }
    }
};