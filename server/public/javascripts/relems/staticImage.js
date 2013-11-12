var StaticImage = rElem.extend({
    isReady:false,
    type:'StaticImage',
    displayLayer: function ( dom ) {
        return '<div rElemID="' + this.instanceName + '"><img src="' + this.data.url + '" /></div>';
    },
    load:function(callback){
        console.log("["+this.instanceName+" StaticImage] load ");
        this.createDom();
        $(this.viewPort).css({backgroundImage:'url('+this.data.url+')',backgroundSize:'cover',backgroundPosition:'50% 50%'});
        callback();
    }    
});
