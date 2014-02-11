var mongoose = require("mongoose");

var DrawingSchema = mongoose.Schema({
    likes: {type:Number, default: 0},
    date: {type: Date, default: Date.now},
    sentOnce: {type: Boolean, default: false, required: true},
    backgroundColor: String,
    width: Number,
    height: Number,
    points: Number,
    validated: {type: Boolean, default: false},
    moderated: {type: Boolean, default: false},
});

DrawingSchema.statics.random = function(query,callback) {
    var query = query;
    this.count(query,function(err, count) {
        if (err) {
            return callback(err);
        }
        var rand = Math.floor(Math.random() * count);
        this.findOne(query).skip(rand).exec(callback);
    }.bind(this));
};

var Drawing = mongoose.model('Drawing', DrawingSchema);
module.exports = Drawing;