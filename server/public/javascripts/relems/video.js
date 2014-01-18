var Video = rElem.extend({
    isReady:false,
    type:'Video',
    load:function(callback){
        this.createDom();
		if ( !this.data.light )
        	this.video = $('<video loop autoplay muted>').attr({'src' : this.data.url+'?1'});
		else
			this.video = $('<video loop autoplay muted>').attr({'src' : this.data.url+'?1#t=2.0'});
		$(this.viewPort).css('background-color','#000');
        $(this.viewPort).append(this.video);
        var height = this.video.height();
        var width = this.video.width();

        if ( this.data.flipped ){
            if ( this.data.flipped == "false" )
                this.data.flipped = false;
            if ( this.data.flipped == "true" )
                this.data.flipped = true;
        }
        if(this.data.flipped && this.data.flipped != "false")
            this.video.addClass("flipped");
		
		this.video.css('width','100%');
		this.video.css('height','100%');
		this.video.css('position','absolute');
		this.video.css('top','50%');
		this.video.css('margin-top','-' + this.video.height()/2 + 'px');
		this.video.css('left','50%');
		this.video.css('margin-left','-' + this.video.width()/2 + 'px');
		

        callback();
    }    
});
