var StaticImage = rElem.extend({
    isReady:false,
    type:'StaticImage',
    displayMode: 'cover',//'center','cover','fit','stretch'
    load:function(callback){
        this.createDom();
        this.displayMode = this.data.displayMode;
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
            backgroundImage:'url('+this.data.url+')',
            backgroundSize:backgroundSize,
            backgroundRepeat:'no-repeat',
            backgroundPosition:'50% 50%'});
        if ( this.locked ){
            $(this.viewPort).css("outline","1px solid black")
        }

        // Preload the image
        var imgLoader = new Image();
        imgLoader.src = this.data.url;
        imgLoader.onload = callback;
        imgLoader.onerror = callback;
    }    
});
