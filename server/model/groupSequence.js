var mongoose = require('mongoose');

var WindowSequenceSchema = mongoose.Schema({
    sequence: mongoose.Schema.ObjectId,
    originX: Number,
    originY: Number,
    loop: {type: Boolean, default: true},
    dateStart: {type: Date, default: Date.now},
    data: {type:mongoose.Schema.Types.Mixed, default:{}}
});

var WindowSequence = mongoose.model('WindowSequence', WindowSequenceSchema);
module.exports = WindowSequence;