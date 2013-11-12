var Color = rElem.extend({
    type:'Color',
    isReady:false,
    color:'FFFFFF',
    opacity:100,
    load:function(callback){
        this.createDom();
        $(this.viewPort).css("background-color",'#'+this.data.color);
        $(this.viewPort).css("opacity",this.data.opacity/100.0);
        callback();
    }
})