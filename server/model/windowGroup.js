var mongoose = require('mongoose');

var WindowGroupWindowSchema = mongoose.Schema({
    window: {type:mongoose.Schema.ObjectId, ref:'Window'},
    x: Number,
    y: Number,
    groupSlide: {type:mongoose.Schema.ObjectId, ref:'GroupSlide', default: null},
    groupSequence: {type:mongoose.Schema.ObjectId, ref:'GroupSequence', default: null}
});

var WindowGroupSchema = mongoose.Schema({
    user: mongoose.Schema.ObjectId,
    windows: [WindowGroupWindowSchema],
    automator: {type:mongoose.Schema.ObjectId, ref:'Automator', default: null},
    width: Number,
    height: Number,
    name: String,
    weightOrder: Number
});

WindowGroupSchema.methods.getWidth = function (){
    var maxW = 0;
    for(var i = 0; i < this.windows.length; i++ ){
        if ( this.windows[i].x > maxW )
            maxW = this.windows[i].x;
    }
    return maxW+1;
}

WindowGroupSchema.methods.getHeight = function (){
    var maxH = 0;
    for(var i = 0; i < this.windows.length; i++ ){
        if ( this.windows[i].y > maxH )
            maxH = this.windows[i].y;
    }
    return maxH+1;
}

var WindowGroup = mongoose.model('WindowGroup', WindowGroupSchema);
module.exports = WindowGroup;