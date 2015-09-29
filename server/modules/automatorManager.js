var Window 			= require('../model/window');
var WindowGroup 	= require('../model/windowGroup');
var Automator		= require('../model/automator');
var AutomatorWorker = require('../modules/automatorWorker')

function AutomatorManager(slideManager){
	this.slideManager = slideManager;
	this.windowGroupWorkers = {};
    var that = this;
    WindowGroup.find({}, function (err, windowGroups){
        if ( err ){
            console.log("Error fetching all groups in AutomatorManager constructor");
            return;
        }
        for ( var i = 0; i < windowGroups.length; i++ ){
            var windowGroup = windowGroups[i];
            if ( windowGroup.automator ){
                that.SetAutomatorForGroup(windowGroup.automator, windowGroup._id);
            }
        }
    })
}

AutomatorManager.prototype.SetAutomatorForGroup = function (automatorId, groupId){
	var that = this;
	console.log("set automator for group " + automatorId + " " + groupId)
	Automator.findById(automatorId, function(err, automator){
		if ( err || automator == null ){
			console.log("Error - Automator not found id=" + automatorId);
			return;
		}
		WindowGroup.findById(groupId, function(err, windowGroup){
			if ( err != null ){
				console.log("Error - WindowGroup not found id=" + groupId);
				return;
			}
			windowGroup.automator = automator._id;
			windowGroup.save(function(err){
				if ( err ){
					console.log("Error saving windowGroup");
					return;
				}
				var worker = new AutomatorWorker(automator, windowGroup, that.slideManager);
				worker.start();
				that.windowGroupWorkers[windowGroup._id] = worker;
			});
		})
	})
}

AutomatorManager.prototype.RemoveAutomatorForGroup = function (groupId){
	this.windowGroupWorkers[groupId].stop();
	delete this.windowGroupWorkers[groupId];
	WindowGroup.findById(groupId, function(err, windowGroup){
		if ( err != null ){
			console.log("Error - WindowGroup not found id=" + groupId);
			return;
		}
		windowGroup.automator = null;
		windowGroup.save(function(err){
			if ( err ){
				console.log("Error saving windowGroup");
				return;
			}
			
		});
	})
}

AutomatorManager.prototype.AddSlideToGroupQueue = function (slide, groupId, slideData){
	if ( groupId ){
		if ( this.windowGroupWorkers[groupId.toString()] ){
			this.windowGroupWorkers[groupId].addElementToQueue(slide, slideData);
		}
	}
}

module.exports = AutomatorManager;