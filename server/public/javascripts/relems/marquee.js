 var Marquee = rElem.extend({
    load:function(callback){
        this.createDom();
        this.type="Marquee";
        if ( this.data.noscroll != true )
            this.textField = $('<marquee  behavior="scroll" scrollamount="'+this.data.speed+'" direction="left" >'+((this.data.text!='')?this.data.text.replace(/ /g,"&nbsp;"):'Entrer le texte ici...')+'</marquee>');
        else
            this.textField = $('<p class="marqu">'+this.data.text+'</p>');
        $(this.viewPort).append(this.textField);
        $(this.textField).css({
            position:'absolute',
            top:'0',
            left:$(this.viewPort).position().left-this.xPx+'px',
            height:'100%',
            lineHeight:$(this.viewPort).height()+'px',
            textAlign:'center',
            color:'#'+this.data.color,
            fontSize:$(this.viewPort).height()+'px',
            fontFamily:this.data.font,
            width:$(this.viewPort).width()+'px',
            textShadow: this.data.shadowDistance + 'px ' + this.data.shadowDistance + 'px 0px #' + this.data.shadowColor
        });
        if ( this.data.noscroll != true )
            this.textField = $(this.textField).marquee("marqu");
        $(this.textField).css({
            position:'absolute',
            top:'0',
            left:$(this.viewPort).position().left-this.xPx+'px',
            height:'100%',
            lineHeight:$(this.viewPort).height()+'px',
            textAlign:'center',
            fontFamily:this.data.font,
            color:'#'+this.data.color,
            fontSize:$(this.viewPort).height()+'px',
            width:$(this.viewPort).width()+'px',
            textShadow: this.data.shadowDistance + 'px ' + this.data.shadowDistance + 'px 0px #' + this.data.shadowColor
        });
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
    waitUntilReady:function(callback){
        callback();
    },
    
});

