var mongoose = require('mongoose');

RelemSchema = mongoose.Schema({
    type: String, 
    data: mongoose.Schema.Types.Mixed, 
    x: Number, 
    y: Number, 
    width: Number, 
    height: Number,
    z: Number,
	locked: Boolean
});

SlideSchema = mongoose.Schema({
    date: {type: Date, default: Date.now},
    lastEdit: {type: Date, default: Date.now},
    name: String,
    clear: {
        type: Boolean,
        default: true
    },
    relems: [RelemSchema],
	user: mongoose.Schema.ObjectId,
	windowModel: mongoose.Schema.ObjectId
});

var Slide = mongoose.model('Slide', SlideSchema);
module.exports = Slide;