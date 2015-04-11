var Window 			= require('../model/window');
var WindowGroup 	= require('../model/windowGroup');
var Automator		= require('../model/automator');
var AutomatorWorker = require('../modules/automatorWorker')

function AutomatorManager(slideManager){
	this.slideManager = slideManager;
}

AutomatorManager.prototype.SetAutomatorForGroup = function (automatorId, groupId){
	var that = this;
	console.log("set automator for group " + automatorId + " " + groupId)
	Automator.findById(automatorId, function(err, automator){
		if ( err ){
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
			});
		})
	})
}

module.exports = AutomatorManager;