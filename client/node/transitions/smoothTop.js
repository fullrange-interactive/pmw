exports.class = { 
    type                        :'smoothTop',
    forceFullDraw               :true,
    speed                       :2000,
    shift                       :0,
    ay                          :0,
    vy                          :0,
    translateY                  :0,
    needBlackBackgroundRedraw   :true,
    beforeDraw                  :function()
    {        
        var target      = this.dimensions.height;
        this.shift      = ((new Date()).getTime() - this.beginning)/this.speed*this.dimensions.height;
        
        this.ay         = (target-this.translateY)/10 - this.vy*0.3;
        this.vy         += this.ay;
        this.translateY += this.vy;

        this.ctx.translate(0,this.translateY-this.dimensions.height);
        this.newRelemsFulldraw();
        this.ctx.translate(0,this.dimensions.height);
    },
    afterDraw:function()
    {
        var target = this.dimensions.height;
        
        this.ctx.translate(0,-this.translateY);
        if(Math.abs(target - this.translateY) < 3 && Math.abs(this.vy) < 5)
        {
            console.log("[transition.smoothTop] Finished");
            this.finished = true;
            this.translateY = 0;
            this.vy = 0;
        }
    }
};
 
