var mongoose = require('mongoose');

var WindowModelSchema = mongoose.Schema({
	cols: [Number],
	rows: [Number],
	user: mongoose.Schema.ObjectId,
	name: String,
	mask: {type:String,default:null},
	ratio: {type:Number,default:1.90217391304}
});

var WindowModel = mongoose.model('WindowModel',WindowModelSchema);
module.exports = WindowModel;