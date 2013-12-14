 var TimeDisplayer = rElem.extend({
    load:function(callback){
        this.createDom();
        this.type="TimeDisplayer";
        var date = new Date();
        
        this.textField = $('<p class="marqu">&nbsp;'+('0'  + date.getHours()).slice(-2)+':'+('0'  + date.getMinutes()).slice(-2)+'&nbsp;</p>');
        
        $(this.viewPort).append(this.textField);
        var nLines = 1;
        var factor = 1.0;
        do{
            $(this.textField).css({
                position:'absolute',
                top:'0',
                left:$(this.viewPort).position().left-this.xPx+'px',
                height:'100%',
                lineHeight:Math.floor($(this.viewPort).height()/nLines)+'px',
                color:'#'+this.data.color,
                fontFamily:this.data.font,
                fontSize:Math.floor($(this.viewPort).height()/1.2/nLines*factor)+'px',
                //width:$(this.viewPort).width()+'px'
            });
            factor -= 0.01;
        }while(($(this.textField).width() > $(this.viewPort).width()));
        $(this.textField).css('width',$(this.viewPort).width()+'px')

        
        callback();
    },
    waitUntilReady:function(callback){
        callback();
    },
    
});

