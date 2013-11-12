var Counter = rElem.extend({
    type:'Counter',
    isReady:false,
    displayLayer: function ( dom ) {
        return '<div rElemID="' + this.instanceName + '">Compteur</div>';
    },
    load:function(callback){
        console.log("["+this.instanceName+" Counter] load ");
        this.createDom();
        this.counterDigit = new Array();
        
        for(var i=0;i<3;i++)
        {
            counterDigitFrame = $("#relem_"+this.uniqueId+"_"+this.cellList[i].x+"_"+this.cellList[i].y);
            
            counterDigit = $("<div>").css({
                position:'absolute',
                top:'0',
                left:counterDigitFrame.position().left-this.xPx+'px',
                height:'100%',
                lineHeight:counterDigitFrame.height()+'px',
                textAlign:'center',
                color:'#'+this.data.color,
                fontSize:counterDigitFrame.height()+'px',
                width:counterDigitFrame.width()+'px'
            }).html('00');
            if ( this.data.flipped ){
                if ( this.data.flipped == "false" )
                    this.data.flipped = false;
                if ( this.data.flipped == "true" )
                    this.data.flipped = true;
            }
            if(this.data.flipped && this.data.flipped != "false")
                this.viewPort.addClass("flipped");
            var date = new Date(parseInt(this.data.date));
            var now = new Date();
            date.setFullYear(now.getFullYear(),now.getMonth(),now.getDate());
            this.data.date = date.getTime();
            var timeout = date.getTime()/1000;
            var counterDigitLoc = this.counterDigit;
            window.setInterval(function(){
                var remaining = timeout-Math.floor(new Date().getTime()/1000);

                $(counterDigitLoc[2]).html(((remaining%60)>=0)?(remaining%60):'0');
                remaining = Math.floor(remaining/60);
                $(counterDigitLoc[1]).html(((remaining%60)>=0)?(remaining%60):'0');
                remaining = Math.floor(remaining/60);
                $(counterDigitLoc[0]).html(((remaining%24)>=0)?(remaining%24):'0');
                
            },200);
            $(this.viewPort).append(counterDigit);            
            this.counterDigit.push(counterDigit);
        }
        
        callback();
    }    
});

