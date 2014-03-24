var mongoose = require('mongoose');

var SequenceEventSchema = mongoose.Schema({
	slide: mongoose.Schema.ObjectId,
	duration: Number,
	timeAt: Number
});

var SequenceSchema = mongoose.Schema({
	name: String,
	duration: Number,
	loop: Boolean,
	user: mongoose.Schema.ObjectId,
	sequenceEvents: [SequenceEventSchema]
});

var Sequence = mongoose.model('Sequence', SequenceSchema);
module.exports = Sequence;