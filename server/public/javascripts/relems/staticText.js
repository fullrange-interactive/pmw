 var StaticText = rElem.extend({
    displayLayer: function ( dom ) {
        return '<div rElemID="' + this.instanceName + '">' + this.data.text.substr(0, 6) + '</div>';
    },
    load:function(callback){
        this.createDom();
        this.type="StaticText";
        this.textField = $('<p class="marqu">'+((this.data.text.length>0)?(this.data.text.replace(/ /g,"&nbsp;").replace(/\n/g,"<br/>")):"Entrer le texte ici...")+'</p>');
        $(this.viewPort).append(this.textField);
        var nLines = this.data.text.split("\n").length;
        var factor = 1.0;
        do{
            $(this.textField).css({
                position:'absolute',
                top:'0',
                left:$(this.viewPort).position().left-this.xPx+'px',
                height:'100%',
                lineHeight:Math.floor($(this.viewPort).height()/nLines)+'px',
                textAlign:'center',
                color:'#'+this.data.color,
                fontFamily:this.data.font,
                fontSize:Math.floor($(this.viewPort).height()/1.2/nLines*factor)+'px',
                //width:$(this.viewPort).width()+'px'
            });
            factor -= 0.01;
        }while(($(this.textField).width() > $(this.viewPort).width()));
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

