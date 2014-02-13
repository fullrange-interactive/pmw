var mongoose = require('mongoose');

var WindowModelSchema = mongoose.schema({
	cols: [Number],
	rows: [Number],
	user: mongoose.Schema.objectId,
	name: String
});

var WindowModel = mongoose.model('WindowModel',WindowModel);
module.exports = WindowModel;