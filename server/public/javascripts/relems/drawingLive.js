var DrawingLive = rElem.extend({
    isReady:false,
    type:'DrawingLive',
    data: {},
    load:function(callback){
        this.createDom();
        $(this.viewPort).css({
			backgroundImage:'url(http://bill.pimp-my-wall.ch/gallery/1440801969919.jpg)',
			backgroundSize:'cover',
			backgroundRepeat:'no-repeat',
			backgroundPosition:'50% 50%'});
		if ( this.locked ){
			$(this.viewPort).css("outline","1px solid black")
		}
        callback();
    }    
});
