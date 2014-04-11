var mongoose = require('mongoose');

var windowGroupWindowSchema = mongoose.schema({
	window: mongoose.Schema.ObjectId,
	x: Number,
	y: Number
});

var WindowGroupSchema = mongoose.schema({
	user: mongoose.Schema.ObjectId,
	windows: [windowGroupWindowSchema],
	name: String
}));