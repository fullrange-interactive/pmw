var mongoose = require('mongoose');

var GroupSlideSchema = mongoose.Schema({
    slide: mongoose.Schema.ObjectId,
	originX: Number,
	originY: Number,
	dateStart: {type: Date, default: Date.now},
    data: {type:mongoose.Schema.Types.Mixed, default:{}}
});

var WindowSlide = mongoose.model('GroupSlide', GroupSlideSchema);
module.exports = WindowSlide;