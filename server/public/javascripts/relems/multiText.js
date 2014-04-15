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
		var that = this;
	},
    waitUntilReady:function(callback){
        callback();
    },
    
});

