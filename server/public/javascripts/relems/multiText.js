var MultiText = rElem.extend({
	textAt: 0,
    load:function(callback){
		this.type="MultiText";
        this.createDom();
		this.draw();
		setTimeout(function (relem){
			relem.passNext();
		},this.data.texts[this.textAt].duration*1000, this);
    },
	passNext: function (){
		this.textAt++;
		if ( this.textAt > this.data.texts.length-1 )
			this.textAt = 0;
		
		this.draw();
			
		setTimeout(function (relem) {
			relem.passNext()
		}, this.data.texts[this.textAt].duration*1000, this);
	},
	draw: function (){
		$(this.viewPort).empty();
		var t = this.data.texts[this.textAt].text;
        this.textField = $('<p class="marqu">'+((t.length>0)?(t.replace(/ /g,"&nbsp;").replace(/\n/g,"<br/>")):"Entrer le texte ici...")+'</p>');
        $(this.viewPort).append(this.textField);
        var nLines = t.split("\n").length;
        var factor = 1.0;
        do{
            $(this.textField).css({
                position:'absolute',
                top:'0',
                left:$(this.viewPort).position().left-this.xPx+'px',
                height:'100%',
                lineHeight:Math.floor($(this.viewPort).height()/nLines)+'px',
                textAlign:this.data.align,
                color:'#'+this.data.color,
                fontFamily:this.data.font,
                fontSize:Math.floor($(this.viewPort).height()/1.2/nLines*factor)+'px',
				padding: '0 10px'
                //width:$(this.viewPort).width()+'px'
            });
            factor *= 0.95;
        }while(($(this.textField).width() > $(this.viewPort).width() * 0.9 ));
        $(this.textField).css('width',$(this.viewPort).width()+'px')
        if ( this.data.flipped ){
            if ( this.data.flipped == "false" )
                this.data.flipped = false;
            if ( this.data.flipped == "true" )
                this.data.flipped = true;
        }
        if(this.data.flipped && this.data.flipped != "false")
            this.textField.addClass("flipped");
		var that = this;
	},
    waitUntilReady:function(callback){
        callback();
    },
    
});

