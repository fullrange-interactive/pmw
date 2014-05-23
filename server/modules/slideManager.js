var Window 			= require('../model/window');
var WindowGroup 	= require('../model/windowGroup');
var GroupSlide		= require('../model/groupSlide');
var GroupSequence	= require('../model/groupSequence');
var Slide 			= require('../model/slide');
var Sequence		= require('../model/sequence')

function SlideManager(windowServer){
	this.windowServer = windowServer;
}

function defineGroupSequence(groupSequence,group,that,sequence,x,y){
    console.log("x = " + x + " y  = " + y + " that = " + that)
    groupSequence.sequence = sequence;
    groupSequence.originX = x;
    groupSequence.originY = y;
    groupSequence.dateStart = Date.now();
    groupSequence.data = {};
    console.log(groupSequence);
    groupSequence.save(function (err,groupSequence){
        if ( err ){
            console.log(err);
            return;
        }
		if ( sequence.music ){
			console.log("MUSIC")
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

function defineGroupSlide(groupSlide,group,that,slide,x,y){
	//console.log("group slide defined")
	groupSlide.slide = slide;
	groupSlide.originX = x;
	groupSlide.originY = y;
	groupSlide.dateStart = Date.now();
	groupSlide.save(function (err,groupSlide){
        if ( err ){
            console.log(err);
        }
		for ( var x = groupSlide.originX; x < groupSlide.originX + slide.width; x++ ){
			for ( var y = groupSlide.originY; y < groupSlide.originY + slide.height; y++ ){
				for ( var i = 0; i < group.windows.length; i++ ){
					if ( group.windows[i].x == x && group.windows[i].y == y ){
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
    var that = this;
    console.log("that=" + that + " sequenceId = " + sequenceId + " windowGroupId = " + windowGroupId + " x = " + x + " y = " + y)
	Sequence.findById(sequenceId, function (err,sequence){
        console.log(err);
		WindowGroup.findById(windowGroupId, function (err,group){
			//Ok, create the groupSlide
            var groupSequence = new GroupSequence();
			if ( loop == "true" )
				groupSequence.loop = true;
			else
				groupSequence.loop = false;
            var found = false;
            console.log(sequence);
			
            defineGroupSequence(groupSequence,group,that,sequence,x,y);
		});
	});    
}

function onDrawingFetched(err, drawing){
    groupSlide.data.drawingIds[relem._id] = drawing._id;
	groupSlide.save();
}

var threads = 0;

SlideManager.prototype.setGroupSlideForXY = function(slideId, windowGroupId, x, y, transition)
{
	var that = this;
	//First, validate
	Slide.findById(slideId, function (err,slide){
		WindowGroup.findById(windowGroupId, function (err,group){
			//Ok, create the groupSlide
            var groupSlide = new GroupSlide();
            var found = false;
            for ( var i = 0; i < slide.relems.length; i++ ){
				var relem = slide.relems[i];
				if ( relem.type == "Drawing" ){
					threads++;
				}
			}
			groupSlide.data.transition = transition;
			groupSlide.data.drawingIds = {};
			for ( var i = 0; i < slide.relems.length; i++ ){
                var relem = slide.relems[i];
                if ( relem.type == "Drawing" ){
                    //console.log("FOUND")
                    found = true;
                    //console.log(relem);
                    if ( relem.data.type == "random"){
						
                        Drawing.findOne({moderated:true, validated:true, sentOnce:false}, {}, {sort:{'date':1}}, (function (relem){
							if ( relem != null ){
								console.log("Sent once")
								relem.sentOnce = true;
								relem.save();
							}
							return function (err, drawing){
	                            if ( !drawing ){
	                                Drawing.random({moderated:true,validated:true},(function(relem){
										if ( relem ){
											console.log("Sent once")
											relem.sentOnce = true;
											relem.save();
										}
										return function (err, drawing){
		                                    groupSlide.data.drawingIds[relem._id] = drawing._id;
											threads--;
											//console.log(groupSlide);
											if ( threads == 0 ){
		                                    	defineGroupSlide(groupSlide,group,that,slide,x,y);
												groupSlide.save();
											}
										};
	                                })(relem)
									);
	                            }else{
	                                groupSlide.data.drawingIds[relem._id] = drawing._id;
									//groupSlide.save();
									//console.log(groupSlide);
									threads--;
									if ( threads == 0 ){
	                                	defineGroupSlide(groupSlide,group,that,slide,x,y);
										groupSlide.save();
									}
	                            }
							};
                        })(relem));
                    }else if ( relem.data.type == "top" ){
                        Drawing.random({moderated:true,validated:true,likes:{$gt:0}}, (function(relem){
							return function(err, drawing){
	                            groupSlide.data.drawingIds[relem._id] = drawing._id;
								threads--;
								if ( threads == 0 ){
	                            	defineGroupSlide(groupSlide,group,that,slide,x,y);
									groupSlide.save();
								}
							};
                        })(relem));
                    }else if ( relem.data.type = "new" ){
                        Drawing.findOne({moderated:true,validated:true}, {}, { sort: { 'date' : -1 } }, (function(relem){
							return function(err, drawing){
	                            groupSlide.data.drawingIds[relem._id] = drawing._id;
								threads--;
								if ( threads == 0 ){
	                            	defineGroupSlide(groupSlide,group,that,slide,x,y);
									groupSlide.save();
								}
							};
                        })(relem));
                    }
					
                }
            }
			if ( !found ){
				defineGroupSlide(groupSlide,group,that,slide,x,y);
			}
		});
	});
}

module.exports = SlideManager;