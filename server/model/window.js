var mongoose = require('mongoose');

var WindowSchema = mongoose.Schema({
    slide: mongoose.Schema.ObjectId,
	sequence: mongoose.Schema.ObjectId,
	name: String,
	user: mongoose.Schema.ObjectId,
    windowId: Number,
    privateIp: {type:String,default:''},
    connected: {type:Boolean,default:false},
	monitoringAction: {type:String,default:'-'},
	lastStatus: String,
	windowModel: mongoose.Schema.ObjectId
});

var Window = mongoose.model('Window', WindowSchema);
module.exports = Window;