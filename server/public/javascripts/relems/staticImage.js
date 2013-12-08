var StaticImage = rElem.extend({
    isReady:false,
    type:'StaticImage',
    load:function(callback){
        console.log("["+this.instanceName+" StaticImage] load ");
        this.createDom();
        $(this.viewPort).css({backgroundImage:'url('+this.data.url+')',backgroundSize:'contain',backgroundPosition:'50% 50%'});
        callback();
    }    
});
