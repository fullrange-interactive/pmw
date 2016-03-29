 var StaticText = rElem.extend({
    load:function(callback){
        this.createDom();
        this.type="StaticText";
        this.textField = $('<p class="marqu">'+((this.data.text.length>0)?(this.data.text.replace(/\n/g,"<br/>")):"Entrer le texte ici...")+'</p>');
        $(this.viewPort).append(this.textField);
        if ( !this.data.padding ){
            this.data.padding = 0;
        }
        if ( !this.data.align ){
            this.data.align = 'center';
        }
        $(this.textField).css({
            width: ($(this.viewPort).width() - 2 * this.data.padding)+'px',
            left: this.data.padding + 'px',
            height: $(this.viewPort).height()+'px',
            position: 'absolute',
            color: '#'+this.data.color,
            padding: '0',
            textAlign:this.data.align,
            fontFamily:this.data.font,
            fontSize: '300px',
            top:0,
        });
        textFit(this.textField,{alignVert: true, multiLine: true, maxFontSize: 200});
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

