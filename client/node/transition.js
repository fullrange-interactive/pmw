exports.transition = { 
    type                        : 'generic',
    forceFullDraw               : false,
    needBlackBackgroundRedraw   : false,
    finished                    : false,
    initialize                  : function(
        ctx,
        pastRelems,
        newRelems,
        wrapper
    )
    {
        this.ctx                = ctx;
        this.pastRelems         = pastRelems;
        this.newRelems          = newRelems;
        this.dimensions         = wrapper;
        this.beginning          = (new Date()).getTime();
        
        console.log("[transition.init] Dimensions: ["+wrapper.width+"x"+wrapper.height+"]@["+wrapper.base.x+":"+wrapper.base.y+"]");
    },
    newRelemsFulldraw : function(){
        for(var i in this.newRelems)
            if(this.newRelems[i].isReady)
                this.newRelems[i].draw(this.ctx);
    },
    parentBeforeDraw  : function(){
        
        if(this.needBlackBackgroundRedraw)
        {
//             console.log("[transition.parentBeforeDraw] Cleaning with black frame ["+mainGrid.width+"x"+mainGrid.height+"] @ ["+mainGrid.wrapper.base.x+":"+mainGrid.wrapper.base.y+"]");
            
            this.ctx.globalAlpha = 1;
            this.ctx.fillStyle   = "#000000";
            this.ctx.fillRect(mainGrid.wrapper.base.x,mainGrid.wrapper.base.y,mainGrid.wrapper.width,mainGrid.wrapper.height);
        }
        
        if(typeof(this.beforeDraw) != 'undefined')
            this.beforeDraw();
        
        /*
         * Once translation if done, clip old slide to avoid it to cover the new one (we admit parent is always drawn after child)
         */
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(mainGrid.wrapper.base.x,mainGrid.wrapper.base.y,mainGrid.wrapper.width,mainGrid.wrapper.height); 
        this.ctx.clip();
        
        if(this.finished)
            this.finish();
    },
    parentAfterDraw   : function(){
        
        this.ctx.restore();

        if(typeof(this.afterDraw) != 'undefined')
            this.afterDraw();
        
        if(this.finished)
            this.finish();
    },
    setFinishCallback : function(callback){

        this.finish = function(){
            console.log("[transition.finish] Finished");
            callback();
        };
    }
};