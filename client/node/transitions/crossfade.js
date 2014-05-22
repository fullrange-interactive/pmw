exports.class = { 
    type                        :'crossfade',
    forceFullDraw               :true,
    duration                    :500,
    status                      :0,
    needBlackBackgroundRedraw   :true,
    afterDraw:function()
    {
        this.shift      = ((new Date()).getTime() - this.beginning)/this.duration; // From 0 to 1

        this.ctx.globalAlpha = this.shift > 1 ? 1 : this.shift;
        this.newRelemsFulldraw();
        this.ctx.globalAlpha = 1;
        
        if(this.shift > 1)
        {
            console.log("[transition.crossfade] Finished");
            this.finished = true;
        }
    }
};
 
