var Strobe = rElem.extend({
    type:'Strobe',
    isReady:false,
	to: null,
	color: null,
    load:function(callback){
        this.createDom();
		this.color = this.data.color;
        $(this.viewPort).css("background-color",'#'+this.data.color);
		var that = this;
		//if ( !this.data.light ){
			this.to = setTimeout(function (){
				that.blink(that);
			},this.data.speed-(new Date().getTime() % this.data.speed));
			//}
        callback();
    },
	blink:function (that){
		that.color = (that.color==that.data.shadowColor)?that.data.color:that.data.shadowColor;
		$(that.viewPort).css("background-color",'#'+that.color);
		window.setTimeout(function (){
			that.blink(that);
		},this.data.speed-(((new Date()).getTime()) % this.data.speed));
	}
});