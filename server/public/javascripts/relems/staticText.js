 var StaticText = rElem.extend({
    load:function(callback){
        this.createDom();
        this.type="StaticText";
        this.textField = $('<p class="marqu">'+((this.data.text.length>0)?(this.data.text.replace(/ /g,"&nbsp;").replace(/\n/g,"<br/>")):"Entrer le texte ici...")+'</p>');
        $(this.viewPort).append(this.textField);
        var nLines = this.data.text.split("\n").length;
        var factor = 1;
		//console.log("viewport = " + $(this.viewPort).width() + " textField = " + $(this.textField).width())
        do{
            $(this.textField).css({
                position:'absolute',
				//display:'inline',
                top:'0',
                left:$(this.viewPort).position().left-this.xPx+'px',
                lineHeight:Math.floor($(this.viewPort).height()/nLines)+'px',
                textAlign:this.data.align,
                color:'#'+this.data.color,
                fontFamily:this.data.font,
                fontSize:Math.floor(factor * $(this.viewPort).height()/1.2/nLines)+'px',
				padding: '0 10px'
                //width:$(this.viewPort).width()+'px'
            });
            factor *= 0.95;
			console.log($(this.textField).width() + ";" + $(this.viewPort).width() + "=>" + factor + ":" + $(this.textField).css('font-size') + "\n")
        }while(($(this.textField).width() > $(this.viewPort).width() * 0.9));
        $(this.textField).css('width',$(this.viewPort).width()+'px')
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

