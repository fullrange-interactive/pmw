var Window      = require('../model/window');
var WindowGroup   = require('../model/windowGroup');
var GroupSlide    = require('../model/groupSlide');
var GroupSequence = require('../model/groupSequence');
var Slide       = require('../model/slide');
var Sequence    = require('../model/sequence')
var fs = require('fs')

function SlideManager(windowServer){
    var walk    = require('walk');
    this.windowServer = windowServer;
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
    
    this.fireworks = ['standard', 'standard-trails', 'standard-half', 'standard-double', 'spiral', 'shockwave', 'saturn', 'powered-trails', 'palm-tree', 'multi'];
}

function defineGroupSequence(groupSequence,group,that,sequence,x,y){
    groupSequence.sequence = sequence;
    groupSequence.originX = x;
    groupSequence.originY = y;
    groupSequence.dateStart = Date.now();
//  groupSequence.data = {};
    groupSequence.save(function (err,groupSequence){
        if ( err ){
            console.log(err);
            return;
        }
        if ( sequence.music ){
            if ( that.windowServer.audioClient ){
                that.windowServer.audioClient.sendAudio(sequence.music, groupSequence.dateStart)
            }
        }
        for ( var x = groupSequence.originX; x < groupSequence.originX + sequence.width; x++ ){
            for ( var y = groupSequence.originY; y < groupSequence.originY + sequence.height; y++ ){
                for ( var i = 0; i < group.windows.length; i++ ){
                    if ( group.windows[i].x == x && group.windows[i].y == y ){
                        group.windows[i].groupSequence = groupSequence._id;
                        group.windows[i].groupSlide = null;
                        Window.findById(group.windows[i].window, function(err, window){
                            var worker = that.windowServer.getWorkerForWindowId(window.windowId);
                            if ( worker != null ){
                                worker.update();
                            }
                        });
                    }
                }
            }
        }
        group.save();
    });
}

function defineGroupSlide(groupSlide,group,that,slide,x,y,dateTimeOffset){
    //console.log("group slide defined")
    groupSlide.slide = slide;
    groupSlide.originX = x;
    groupSlide.originY = y;
    dateTimeOffset = dateTimeOffset || 0;
    groupSlide.dateStart = Date.now() + dateTimeOffset;
    groupSlide.save(function (err,groupSlide){
        if ( err ){
            console.log(err);
        }
        for ( var x = groupSlide.originX; x < groupSlide.originX + slide.width; x++ ){
            for ( var y = groupSlide.originY; y < groupSlide.originY + slide.height; y++ ){
                for ( var i = 0; i < group.windows.length; i++ ){
                    if ( group.windows[i].x == x && group.windows[i].y == y ){
                        //Go through every window in this groupslide and set its groupslide
                        group.windows[i].groupSlide = groupSlide._id;
                        group.windows[i].groupSequence = null;
                        Window.findById(group.windows[i].window, function(err, window){
                            var worker = that.windowServer.getWorkerForWindowId(window.windowId);
                            if ( worker != null )
                                worker.update();
                        });
                    }
                }
            }
        }
        group.save();
    });
}

SlideManager.prototype.setGroupSequenceForXY = function(sequenceId, windowGroupId, x, y, loop)
{
    var preProcessItems = 0;
    var that = this;
    console.log("that=" + that + " sequenceId = " + sequenceId + " windowGroupId = " + windowGroupId + " x = " + x + " y = " + y)
    Sequence.findById(sequenceId).populate('sequenceEvents.slides.slide').execFind(function (err,sequences){
        console.log(err);
        WindowGroup.findById(windowGroupId, function (err,group){
            //Ok, create the groupSequence
            var sequence = sequences[0];
            var groupSequence = new GroupSequence();
            groupSequence.data.slideIds = {};
            if ( loop == "true" )
                groupSequence.loop = true;
            else
                groupSequence.loop = false;
            
            //Pre-process the sequence
            var preProcessingNeeded = false;
            var preProcessItems = 0;
            for ( var i = 0; i < sequence.sequenceEvents.length; i++ ){
                for ( var  j = 0; j < sequence.sequenceEvents[i].slides.length; j++ ){
                    for ( var k = 0; k < sequence.sequenceEvents[i].slides[j].slide.relems.length; k++ )
                        if ( sequence.sequenceEvents[i].slides[j].slide.relems && sequence.sequenceEvents[i].slides[j].slide.relems[k].type == "Drawing" ){
                            preProcessingNeeded = true;
                            preProcessItems++;
                            groupSequence.data.slideIds[sequence.sequenceEvents[i].slides[j]._id] = {relems:{}};
                        }
                }
            }
            
            for ( var i = 0; i < sequence.sequenceEvents.length; i++ ){
                for ( var  j = 0; j < sequence.sequenceEvents[i].slides.length; j++ ){
                    for ( var k = 0; k < sequence.sequenceEvents[i].slides[j].slide.relems.length; k++ ){
                        var sequenceEventSlide = sequence.sequenceEvents[i].slides[j];
                        var relem = sequenceEventSlide.slide.relems[k];
                        if ( relem.type == "Drawing" ){
                            Drawing.findOfType(relem.data.type, (function (sequenceEventSlide, relem){
                                return function(error, drawing){
                                    groupSequence.data.slideIds[sequenceEventSlide._id].relems[relem._id] = {drawingId:drawing._id};
                                    preProcessItems--;
                                    if ( preProcessItems == 0 ){
                                        defineGroupSequence(groupSequence, group, that, sequence, x, y);
                                        groupSequence.save();
                                    }
                                };
                            })(sequenceEventSlide, relem));
                        }
                    }
                }
            }
            
            if ( !preProcessingNeeded ){
                defineGroupSequence(groupSequence, group, that, sequence, x, y);
            }
        });
    });    
}

SlideManager.prototype.setGroupSlideForGroup = function(slideId, windowGroupId, transition, slideData){
    WindowGroup.findById(windowGroupId, function (err, group){
        for ( var x = 0; x < group.width; x++ ){
            for ( var y = 0; y < group.height; y++ ){
                this.setGroupSlideForXY(slideId, windowGroupId, x, y, transition, slideData);
            }
        }
    }.bind(this));
}

SlideManager.prototype.setGroupSlideForXY = function(slideId, windowGroupId, x, y, transition, slideData){
    var that = this;
    //First, validate
    Slide.findById(slideId, function (err,slide){
        WindowGroup.findById(windowGroupId, function (err,group){
            //Ok, create the groupSlide
            var groupSlide = new GroupSlide();
            groupSlide.data.transition = transition;
            groupSlide.data.relems = {};
            
            //Pre-process the slide
            var preProcessingNeeded = false;
            var preProcessItems = 0;
            var dateTimeOffset = 0;
            
            
            if ( slide._id != Configuration.drawingSlideId ){
                for ( var i = 0; i < slide.relems.length; i++ ){
                    var relem = slide.relems[i];
                    if ( relem.type == "Drawing" ){
                        preProcessingNeeded = true;
                        preProcessItems++;
                    }
                }
                for ( var i = 0; i < slide.relems.length; i++ ){
                    var relem = slide.relems[i];
                    if ( relem.type == "Drawing" ){
                        Drawing.findOfType(relem.data.type, (function (relem){
                            return function(err, drawing){
                                groupSlide.data.relems[relem._id] = {drawingId:drawing._id};
                                preProcessItems--;
                                if ( preProcessItems == 0 ){
                                    defineGroupSlide(groupSlide,group,that,slide,x,y);
                                    groupSlide.save();
                                }
                            };
                        })(relem));
                    }
                }
            }       
            
            if ( slide._id == Configuration.drawingSlideId ){
                for ( var i = 0; i < slide.relems.length; i++ ){
                    var relem = slide.relems[i];
                    if ( relem.type == "Drawing" && slideData ){
                        groupSlide.data.relems[relem._id] = {drawingId: slideData.drawing};
                        groupSlide.save();
                    }
                }
            }
            
            if ( slide._id == Configuration.vjingSlideId ){
                for ( var i = 0; i < slide.relems.length; i++ ){
                    var relem = slide.relems[i];
                    if ( relem.type == "Video" ){
                        if ( slideData ){
                            groupSlide.data.relems[relem._id] = {url: slideData.clip};
                        }else{
                            if ( that.vjingVideosReady ){
                                var rand = Math.floor(Math.random()*that.vjingVideos.length);
                                groupSlide.data.relems[relem._id] = {url: that.vjingVideos[rand]};
                            }
                        }
                        groupSlide.save();
                    }
                }
            }
                        
            if ( slide._id == Configuration.photoGallerySlideId ){
                for ( var i = 0; i < slide.relems.length; i++ ){
                    var relem = slide.relems[i];
                    if ( relem.type == "StaticImage" ){
                        //Start the slide 10 seconds in the past
                        dateTimeOffset = -3600 * 1000;
                        if ( slideData ){
                            groupSlide.data.relems[relem._id] = { url: slideData.url };
                        }
                        groupSlide.save();
                    }
                }
            }
                        
            if ( slide._id == Configuration.fireworksSlideId ){
                for ( var i = 0; i < slide.relems.length; i++ ){
                    var relem = slide.relems[i];
                    if ( relem.type == "Fireworks" ){
                        //Start the slide 1 second in the future
                        dateTimeOffset = 1000;
                        if ( slideData ){
                            groupSlide.data.relems[relem._id] = {
                                    type: slideData.type,
                                    angle: slideData.angle,
                                    power: slideData.power,
                                    secondaryColor: slideData.secondaryColor,
                                    primaryColor: slideData.primaryColor,
                                    seed: slideData.seed
                            };
                        }else{
                            var rand = Math.floor(Math.random()*that.fireworks.length);
                            groupSlide.data.relems[relem._id] = {type: that.fireworks[rand]};
                        }
                        groupSlide.save();
                    }
                }
            }
                        
            //If no pre-processing is needed on these relems, then we 
            //can define the groupslide immediatly. Otherwise, we need to wait
            //until all pre-processed relems are finished
            if ( !preProcessingNeeded ){
                defineGroupSlide(groupSlide,group,that,slide,x,y,dateTimeOffset);
            }
        });
    });
}

module.exports = SlideManager;