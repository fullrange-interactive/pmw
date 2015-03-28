var mongoose = require('mongoose');


var AutomatorGroupSchema = mongoos.Schema({
	slides: [{type:mongoose.Schema.ObjectId, ref:'Slide'}],
	data: {type:mongoose.Schema.Types.Mixed, default:{}},
	frequency: Number,
	type: String
});

var AutomatorSchema = mongoose.Schema({
	groups: [AutomatorSlideGroupSchema],
	data: {type:mongoose.Schema.Types.Mixed, default:{}}
});

var Automator = mongoose.model('Automator', AutomatorSchema);
var AutomatorGroup = mongoose.model()
module.exports = WindowSlide;