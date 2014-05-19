var Flash = rElem.extend({
    type:'Flash',
    isReady:false,
    color:'FFFFFF',
    opacity:100,
    load:function(callback){
        this.createDom();
        $(this.viewPort).css("background-color",'#'+this.data.color);
        $(this.viewPort).css("opacity",this.data.opacity/100.0);
		$(this.viewPort).animate({opacity:0},parseInt(this.data.duration));
        callback();
    }
})