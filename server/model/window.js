var mongoose = require('mongoose');

var WindowModelSchema = mongoose.Schema({
	columnRatios:[Number],
	lineRatios:[Number],
	maskCells:[Boolean]
});


var WindowSchema = mongoose.Schema({
    slide: mongoose.Schema.ObjectId,
	sequence: mongoose.Schema.ObjectId,
	name: String,
	user: mongoose.Schema.ObjectId,
    windowId: Number,
    privateIp: {type:String,default:''},
    connected: {type:Boolean,default:false}
});

var Window = mongoose.model('Window', WindowSchema);
module.exports = Window;