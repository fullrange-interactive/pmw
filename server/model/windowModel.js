var mongoose = require('mongoose');

var WindowModelSchema = mongoose.Schema({
    cols: [Number],
    rows: [Number],
    user: mongoose.Schema.ObjectId,
    name: String,
    mask: {type:String,default:null},
    ratio: {type:Number,default:1.90217391304},
    margin: {
        x: {type:Number, default:0.03},
        y: {type:Number, default:0.04},
        top: Number,
        bottom: Number,
        left: Number,
        right: Number
    },
    isDMX: {tyoe:Boolean, default: false},
    dmxIP: String
});

var WindowModel = mongoose.model('WindowModel',WindowModelSchema);
module.exports = WindowModel;