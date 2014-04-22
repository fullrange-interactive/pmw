var Window 			= require('../model/window');
var WindowGroup 	= require('../model/windowGroup');
var GroupSlide		= require('../model/groupSlide');
var GroupSequence	= require('../model/groupSequence');
var Slide 			= require('../model/slide');
var Sequence		= require('../model/sequence')

function SlideManager(windowServer){
	this.windowServer = windowServer;
}

SlideManager.prototype.setGroupSlideForXY = function(slideId, windowGroupId, x, y)
{
	var that = this;
	//First, validate
	Slide.findById(slideId, function (err,slide){
		WindowGroup.findById(windowGroupId, function (err,group){
			//Ok, create the groupSlide
			var groupSlide = new GroupSlide();
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
		});
	});
}

module.exports = SlideManager;