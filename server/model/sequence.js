var mongoose = require('mongoose');

var SequenceEventSlideSchema = mongoose.Schema({
    slide: {type:mongoose.Schema.ObjectId, ref:'Slide'},
    winX: Number,
    winY: Number
})

var SequenceEventSchema = mongoose.Schema({
	slides: [SequenceEventSlideSchema],
	duration: Number,
	timeAt: Number
});

var SequenceSchema = mongoose.Schema({
	name: String,
	duration: Number,
	loop: Boolean,
	user: mongoose.Schema.ObjectId,
	sequenceEvents: [SequenceEventSchema],
    windowModel: {type:mongoose.Schema.ObjectId, ref:'WindowModel'},
    width: {type: Number, default: 1},
    height: {type: Number, default: 1}
});

var Sequence = mongoose.model('Sequence', SequenceSchema);
module.exports = Sequence;