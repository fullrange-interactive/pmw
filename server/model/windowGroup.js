var mongoose = require('mongoose');

var windowGroupWindowSchema = mongoose.schema({
	
});

var WindowGroupSchema = mongoose.schema({
	user: mongoose.Schema.ObjectId,
	windows: [windowGroupWindowSchema],
	name: String
}));