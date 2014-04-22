var mongoose = require('mongoose');

var WindowSchema = mongoose.Schema({
	name: String,
	user: mongoose.Schema.ObjectId,
    windowId: Number,
    privateIp: {type:String,default:''},
	connected: {type:Boolean},
	monitoringAction: {type:String,default:'-'},
	lastStatus: String,
	windowModel: mongoose.Schema.ObjectId,
	group: mongoose.Schema.ObjectId
});

var Window = mongoose.model('Window', WindowSchema);
module.exports = Window;