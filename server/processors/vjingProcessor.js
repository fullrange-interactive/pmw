var ProcessorPlugin = require('../modules/processor');
var util = require('util');
var walk = require('walk');

var VJingProcessor = function VJingProcessor(){
    VJingProcessor.super_.call(this);

    //Please forgive me for this!
    this.vjingVideos = [];
    this.vjingVideosReady = false;
    
    var that = this;    
    var walker = walk.walk('public/vjing-videos/', { followLinks: false});

    walker.on('file', function(root, stat, next) {
        // Add this file to the list of files
        if(stat.name == ".DS_Store"){
            next();
            return;
        }
        that.vjingVideos.push("http://" + Configuration.url + root.replace("public","") + '' + stat.name);
        next();
    });

    walker.on('end', function() {
        that.vjingVideosReady = true;
    });
}

util.inherits(VJingProcessor, ProcessorPlugin);

VJingProcessor.prototype.processGroupSlide = function (groupSlide, slide, slideData, doneCallback){
    var data = {relems: {}};

    if ( slide._id == Configuration.vjingSlideId ){
        for ( var i = 0; i < slide.relems.length; i++ ){
            var relem = slide.relems[i];
            if ( relem.type == "Video" ){
                if ( slideData ){
                    data.relems[relem._id] = {url: slideData.clip};
                }else{
                    if ( this.vjingVideosReady ){
                        var rand = Math.floor(Math.random()*this.vjingVideos.length);
                        data.relems[relem._id] = {url: this.vjingVideos[rand]};
                    }
                }
            }
        }
    }

    doneCallback(0, data);
}

module.exports = VJingProcessor;