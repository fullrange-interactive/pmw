var Window 			= require('../model/window');
var WindowGroup 	= require('../model/windowGroup');
var GroupSlide		= require('../model/groupSlide');
var GroupSequence	= require('../model/groupSequence');
var Slide 			= require('../model/slide');
var Sequence		= require('../model/sequence')

function SlideManager(windowServer){
	this.windowServer = windowServer;
}

function defineGroupSlide(groupSlide,group,that,slide,x,y){
	groupSlide.slide = slide;
	groupSlide.originX = x;
	groupSlide.originY = y;
	groupSlide.dateStart = Date.now();
	groupSlide.save(function (err,groupSlide){
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
                    console.log("FOUND")
                    found = true;
                    console.log(relem);
                    if ( relem.data.type == "random"){
                        Drawing.findOne({moderated:true, validated:true, sentOnce:false}, {}, {sort:{'date':1}}, function (err, drawing){
                            if ( !drawing ){
                                Drawing.random({moderated:true,validated:true},function (err, drawing){
                                    groupSlide.data.drawingId = drawing._id;
                                    defineGroupSlide(groupSlide,group,that,slide,x,y);
                                });
                            }else{
                                groupSlide.data.drawingId = drawing._id;
                                defineGroupSlide(groupSlide,group,that,slide,x,y);
                            }
                        });
                    }else if ( relem.data.type == "top" ){
                        Drawing.random({moderated:true,validated:true,likes:{$gt:0}}, function(err, drawing){
                            groupSlide.data.drawingId = drawing._id;
                            defineGroupSlide(groupSlide,group,that,slide,x,y);
                        });
                    }else if ( relem.data.type = "new" ){
                        Drawing.findOne({moderated:true,validated:true}, {}, { sort: { 'date' : -1 } }, function(err, drawing){
                            groupSlide.data.drawingId = drawing._id;
                            defineGroupSlide(groupSlide,group,that,slide,x,y);
                        });
                    }
                }
            }
            if ( !found ){
                defineGroupSlide(groupSlide,group,that,x,y);
            }
		});
	});
}

module.exports = SlideManager;