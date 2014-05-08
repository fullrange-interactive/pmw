var mongoose = require('mongoose');

var SequenceEventSlideSchema = mongoose.Schema({
    slide: mongoose.Schema.ObjectId,
    winX: Number,
    winY: Number
})

var SequenceEventSchema = mongoose.Schema({
	slides: [SequenceEventSlideSchema],
	duration: Number,
	timeAt: Number
});

var SequenceEvent = mongoose.model('SequenceEvent', SequenceSchema);
module.exports.SequenceEventSchema = SequenceEventSchema;
module.exports.SequenceEvent = SequenceEvent;