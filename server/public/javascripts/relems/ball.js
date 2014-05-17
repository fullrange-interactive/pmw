var Ball = rElem.extend({
    isReady:false,
    type:'Ball',
	displayMode: 'cover',//'center','cover','fit','stretch'
    load:function(callback){
        this.createDom();
		this.displayMode = 'cover';
		switch(this.displayMode){
		case 'cover':
			backgroundSize = 'cover';
			break;
		case 'fit':
			backgroundSize = 'contain';
			break;
		case 'stretch':
			backgroundSize = '100% 100%';
			break;
		case 'center':
			backgroundSize = 'auto';
		}
        $(this.viewPort).css({
			backgroundImage:'url(http://baleinev.ch:443/gallery/1400359123019.jpg)',
			backgroundSize:backgroundSize,
			backgroundRepeat:'no-repeat',
			backgroundPosition:'50% 50%'});
		if ( this.locked ){
			$(this.viewPort).css("outline","1px solid black")
		}
        callback();
    }    
});
