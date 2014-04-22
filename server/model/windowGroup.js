var mongoose = require('mongoose');
var Window = require('./window')
var GroupSlide = require('../model/groupSlide');
var GroupSequence = require('../model/groupSequence');

var WindowGroupWindowSchema = mongoose.Schema({
	window: {type:mongoose.Schema.ObjectId, ref:'Window'},
	x: Number,
	y: Number,
	groupSlide: {type:mongoose.Schema.ObjectId, ref:'GroupSlide', default: null},
	groupSequence: {type:mongoose.Schema.ObjectId, ref:'GroupSequence', default: null}
});

var WindowGroupSchema = mongoose.Schema({
	user: mongoose.Schema.ObjectId,
	windows: [WindowGroupWindowSchema],
	name: String
});

var WindowGroup = mongoose.model('WindowGroup', WindowGroupSchema);
module.exports = WindowGroup;