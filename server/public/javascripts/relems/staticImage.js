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

        var imageContainer = $("<div>");

        imageContainer.css({
            backgroundImage: 'url('+this.data.url+')',
            backgroundSize: backgroundSize,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '50% 50%',
            width: '100%',
            height: '100%'
        });

        $(this.viewPort).append(imageContainer);
        $(this.viewPort).css({
            overflow: 'visible'
        })

        if ( this.locked ){
            $(this.viewPort).css("outline","1px solid black")
        }

        if (this.data.floating) {
            this.sin = Math.random() * 300;
            $(imageContainer).css({
                'transition': 'transform linear 1s'
            })
            this.floatInterval = setInterval(function () {
                var val = this.sin;
                $(imageContainer).css({
                    transform: 'rotate(' + (Math.sin(val)*1.5) + 'deg) translate(' + (8 * Math.cos(val/2)) + 'px,' + (8.2 * Math.sin(val/3.5)) + 'px)'
                });
                val += 0.06;
                this.sin = val;
            }.bind(this), 30);
        }

        // Preload the image
        var imgLoader = new Image();
        imgLoader.src = this.data.url;
        imgLoader.onload = callback;
        imgLoader.onerror = callback;
    },
    cleanup: function () {
        if (this.data.floating) {
            clearInterval(this.floatInterval);
        }
    }
});
