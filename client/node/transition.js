exports.transition = {
    type                : 'generic',
    forceFullDraw       : false,
    finished            : false,
    initialize  : function(
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
        if(typeof(this.beforeDraw) != 'undefined')
            this.beforeDraw();
        
        if(this.finished)
            this.finish();
    },
    parentAfterDraw   : function(){
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