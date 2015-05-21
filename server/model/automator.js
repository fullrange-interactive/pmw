var mongoose = require('mongoose');

var CollectionElement = mongoose.Schema({
	element: {type:mongoose.Schema.ObjectId},
	data: {type:mongoose.Schema.Types.Mixed, default:{}},
	type: String
})

var CollectionSchema = mongoose.Schema({
	collectionElements: [CollectionElement],
	data: {type:mongoose.Schema.Types.Mixed, default:{}},
	period: Number,
	type: String
});

var AutomatorSchema = mongoose.Schema({
	collections: [CollectionSchema],
	user: mongoose.Schema.ObjectId,
	name: String,
	data: {type:mongoose.Schema.Types.Mixed, default:{}},
    defaultDuration: {type:Number, default: 7000}
});

var Automator = mongoose.model('Automator', AutomatorSchema);
module.exports = Automator;