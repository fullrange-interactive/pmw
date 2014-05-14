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
		for ( var x = groupSequence.originX; x < groupSequence.originX + sequence.width; x++ ){
			for ( var y = groupSequence.originY; y < groupSequence.originY + sequence.height; y++ ){
				for ( var i = 0; i < group.windows.length; i++ ){
					if ( group.windows[i].x == x && group.windows[i].y == y ){
						group.windows[i].groupSequence = groupSequence._id;
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

SlideManager.prototype.setGroupSequenceForXY = function(sequenceId, windowGroupId, x, y)
{
    var that = this;
    console.log("that=" + that + " sequenceId = " + sequenceId + " windowGroupId = " + windowGroupId + " x = " + x + " y = " + y)
	Sequence.findById(sequenceId, function (err,sequence){
        console.log(err);
		WindowGroup.findById(windowGroupId, function (err,group){
			//Ok, create the groupSlide
            var groupSequence = new GroupSequence();
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

SlideManager.prototype.setGroupSlideForXY = function(slideId, windowGroupId, x, y)
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
			for ( var i = 0; i < slide.relems.length; i++ ){
                var relem = slide.relems[i];
                if ( relem.type == "Drawing" ){
                    //console.log("FOUND")
                    found = true;
					groupSlide.data.drawingIds = {};
                    //console.log(relem);
                    if ( relem.data.type == "random"){
                        Drawing.findOne({moderated:true, validated:true, sentOnce:false}, {}, {sort:{'date':1}}, (function (relem){
							return function (err, drawing){
	                            if ( !drawing ){
	                                Drawing.random({moderated:true,validated:true},(function(relem){
										return function (err, drawing){
		                                    groupSlide.data.drawingIds[relem._id] = drawing._id;
											groupSlide.save();
											threads--;
											if ( threads == 0 )
		                                    	defineGroupSlide(groupSlide,group,that,slide,x,y);
										};
	                                })(relem)
									);
	                            }else{
	                                groupSlide.data.drawingIds[relem._id] = drawing._id;
									groupSlide.save();
									threads--;
									if ( threads == 0 )
	                                	defineGroupSlide(groupSlide,group,that,slide,x,y);
	                            }
							};
                        })(relem));
                    }else if ( relem.data.type == "top" ){
                        Drawing.random({moderated:true,validated:true,likes:{$gt:0}}, (function(relem){
							return function(err, drawing){
	                            groupSlide.data.drawingIds[relem._id] = drawing._id;
								groupSlide.save();
								threads--;
								if ( threads == 0 )
	                            	defineGroupSlide(groupSlide,group,that,slide,x,y);
							};
                        })(relem));
                    }else if ( relem.data.type = "new" ){
                        Drawing.findOne({moderated:true,validated:true}, {}, { sort: { 'date' : -1 } }, (function(relem){
							return function(err, drawing){
	                            groupSlide.data.drawingIds[relem._id] = drawing._id;
								groupSlide.save();
								threads--;
								if ( threads == 0 )
	                            	defineGroupSlide(groupSlide,group,that,slide,x,y);
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