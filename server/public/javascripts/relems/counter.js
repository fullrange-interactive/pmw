var Counter = rElem.extend({
    type:'Counter',
    isReady:false,
	countCells:0,
    load:function(callback){
        this.createDom();
        this.counterDigit = new Array();
        for(var i=0; this.countCells < 3 && i < this.cellList.length; i++)
        {
            counterDigitFrame = $("#relem_"+this.uniqueId+"_"+this.cellList[i].x+"_"+this.cellList[i].y);
			if ( counterDigitFrame.width() < 20 ){
				console.log("too small")
				continue;
			}else{
				this.countCells++;
			}
            counterDigit = $("<div>").css({
                position:'absolute',
                top:'0',
                left:counterDigitFrame.position().left-this.xPx+'px',
                height:'100%',
                lineHeight:counterDigitFrame.height()/1.3+'px',
                textAlign:'center',
                color:'#'+this.data.color,
                fontSize:counterDigitFrame.height()/1.3+'px',
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
			var that = this;
            window.setInterval(function(){
                var remaining = timeout-Math.floor(new Date().getTime()/1000);
				if ( remaining < -60 ){
					remaining += 24*3600;
				}
				if ( that.countCells == 3 ){
                	$(counterDigitLoc[2]).html((((remaining%60)>=0)?(remaining%60):'0') + '<div class="unitlabel">secondes</div>');
                	remaining = Math.floor(remaining/60);
                	$(counterDigitLoc[1]).html((((remaining%60)>=0)?(remaining%60):'0') + '<div class="unitlabel">minutes</div>');
                	remaining = Math.floor(remaining/60);
					$(counterDigitLoc[0]).html((((remaining%24)>=0)?(remaining%24):'0') + '<div class="unitlabel">heures</div>');
				}else if ( that.countCells == 2 ){
                	$(counterDigitLoc[1]).html((((remaining%60)>=0)?(remaining%60):'0') + '<div class="unitlabel">secondes</div>');
                	remaining = Math.floor(remaining/60);
                	$(counterDigitLoc[0]).html((((remaining%60)>=0)?(remaining%60):'0') + '<div class="unitlabel">minutes</div>');				
				}else if ( that.countCells == 1 ){
                	$(counterDigitLoc[0]).html((((remaining%60)>=0)?(remaining%60):'0') + '<div class="unitlabel">secondes</div>');			
				}
                
            },200);
            $(this.viewPort).append(counterDigit);            
            this.counterDigit.push(counterDigit);
        }
        
        callback();
    }    
});

