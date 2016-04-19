 var Marquee = rElem.extend({
    destroyed: false,
    load: function(callback) {
        this.createDom();
        this.type="Marquee";
        this.textField = $('<p class="marqu">' + this.data.text + '</p>');
        $(this.viewPort).append(this.textField);
        $(this.textField).css({
            position:'absolute',
            top:'0',
            left:$(this.viewPort).position().left - this.xPx + 'px',
            height:'100%',
            lineHeight:$(this.viewPort).height() + 'px',
            textAlign:'center',
            color:'#'+this.data.color,
            fontSize:$(this.viewPort).height() + 'px',
            fontFamily:this.data.font,
            overvlow: 'visible',
            whiteSpace: 'nowrap',
            // width:$(this.viewPort).width() + 'px',
            textShadow: this.data.shadowDistance + 'px ' + this.data.shadowDistance + 'px 0px #' + this.data.shadowColor
        });
        if ( this.data.light != true )
            $(this.textField).pmwMarquee({speed: this.data.speed});
        // $(this.textField).css({
        //     position:'absolute',
        //     top:'0',
        //     left:$(this.viewPort).position().left-this.xPx+'px',
        //     height:'100%',
        //     lineHeight:$(this.viewPort).height()+'px',
        //     textAlign:'center',
        //     fontFamily:this.data.font,
        //     color:'#'+this.data.color,
        //     fontSize:$(this.viewPort).height()+'px',
        //     width:$(this.viewPort).width()+'px',
        //     textShadow: this.data.shadowDistance + 'px ' + this.data.shadowDistance + 'px 0px #' + this.data.shadowColor
        // });
        if ( this.data.flipped ){
            if ( this.data.flipped == "false" )
                this.data.flipped = false;
            if ( this.data.flipped == "true" )
                this.data.flipped = true;
        }
        if(this.data.flipped && this.data.flipped != "false")
            this.textField.addClass("flipped");
        callback();
    },
    waitUntilReady: function(callback) {
        callback();
    },
    cleanup: function() {
        // console.log("CLEAN");
        if (!this.destroyed) {
            $(this.textField).stopPmwMarquee();
            this.destroyed = true;
        }
    }
    
});

