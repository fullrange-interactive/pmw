var mongoose = require('mongoose');

var WindowSequenceSchema = mongoose.Schema({
    sequence: mongoose.Schema.ObjectId,
	originX: Number,
	originY: Number,
	dateStart: {type: Date, default: Date.now}
});

var WindowSequence = mongoose.model('WindowSequence', WindowSequenceSchema);
module.exports = WindowSequence;