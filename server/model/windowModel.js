var mongoose = require('mongoose');

var WindowModelSchema = mongoose.Schema({
	cols: [Number],
	rows: [Number],
	user: mongoose.Schema.ObjectId,
	name: String,
	mask: {type:String,default:null}
});

var WindowModel = mongoose.model('WindowModel',WindowModelSchema);
module.exports = WindowModel;