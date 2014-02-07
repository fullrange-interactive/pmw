var TimeSync = rElem.extend({
    type:'TimeSync',
    isReady:false,
    color:'FFFFFF',
	to: null,
    load:function(callback){
		this.color = 'FFFFFF';
        this.createDom();
        $(this.viewPort).css("background-color",'#'+this.color);
		var that = this;
		this.to = setTimeout(function (){
			that.blink(that);
		},1000-(new Date().getTime() % 1000));
        callback();
    },
	blink:function (that){
		that.color = (that.color=='FFFFFF')?'000000':'FFFFFF';
		$(that.viewPort).css("background-color",'#'+that.color);
		window.setTimeout(function (){
			that.blink(that);
		},1000-(((new Date()).getTime()) % 1000));
	}
});