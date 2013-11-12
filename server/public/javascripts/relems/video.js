var Video = rElem.extend({
    isReady:false,
    type:'Video',
    displayLayer: function ( dom ) {
        return '<div rElemID="' + this.instanceName + '">' + this.data.url.split('/')[4] + '</div>';
    },
    load:function(callback){
        console.log("["+this.instanceName+" Video] load ");
        this.createDom();
        this.video = $('<video loop autoplay muted>').attr({'src' : this.data.url});
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

        if (height < width )
        	this.video.attr('width', "100%");
        else 
        	this.video.attr('height', "100%");

        callback();
    }    
});
