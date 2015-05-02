var mongoose = require('mongoose');

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
	automator: {type:mongoose.Schema.ObjectId, ref:'Automator', default: null},
	width: Number,
	height: Number,
	name: String
});

var WindowGroup = mongoose.model('WindowGroup', WindowGroupSchema);
module.exports = WindowGroup;