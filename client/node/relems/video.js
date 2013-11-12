exports.class = {
    type:'Video',
    draw:function(ctx)
    {},
    isReady:false,
    load:function(callback){
        this.omx = require('omxcontrol');
        this.omx.start(this.data.url,this.left,this.top,this.left+this.width,this.top+this.height);
        this.isReady = true;
        callback();
    },
    cleanup:function(){
        this.omx.quit();
   }
};