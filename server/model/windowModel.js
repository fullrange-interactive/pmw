var mongoose = require('mongoose');

var WindowModelSchema = mongoose.Schema({
	cols: [Number],
	rows: [Number],
	user: mongoose.Schema.objectId,
	name: String
});

var WindowModel = mongoose.model('WindowModel',WindowModelSchema);
module.exports = WindowModel;