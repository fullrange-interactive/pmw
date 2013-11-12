var StaticImage = rElem.extend({
    isReady:false,
    type:'StaticImage',
    load:function(callback){
        console.log("["+this.instanceName+" StaticImage] load ");
        this.createDom();
        $(this.viewPort).css({backgroundImage:'url('+this.data.url+')',backgroundSize:'cover',backgroundPosition:'50% 50%'});
        callback();
    }    
});
