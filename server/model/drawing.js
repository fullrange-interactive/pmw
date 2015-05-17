var mongoose = require("mongoose");

var DrawingSchema = mongoose.Schema({
	likes: {type:Number, default: 0},
	date: {type: Date, default: Date.now},
	sentOnce: {type: Boolean, default: false, required: true},
	backgroundColor: String,
	backgroundImage: {type: String, default: null},
	width: Number,
	height: Number,
	points: Number,
	validated: {type: Boolean, default: false},
	moderated: {type: Boolean, default: false},
	deleted: {type: Boolean, default: false},
	preferredGroupId: {type: mongoose.Schema.ObjectId}
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

DrawingSchema.statics.findOfType = function(type,callback){
	if ( type == "random" ){
		this.fetchRandom(false, callback);
	}else if ( type == "trueRandom" ){
		this.fetchRandom(true, callback);
	}else if ( type == "top" ){
		this.fetchTop(callback);
	}else if ( type == "new" ){
		this.fetchLatest(callback);
	}
}

DrawingSchema.statics.fetchRandom = function(trueRandom, callback){
	if ( trueRandom ){
		this.random({moderated:true,validated:true}, callback);
	}else{
		this.findOne({moderated:true, validated:true, sentOnce:false}, {}, {sort:{'date':1}}, function (err, drawing){
			if ( !drawing ){
				Drawing.random({moderated:true,validated:true}, callback);
			}else{
				callback(err,drawing);
			}
		});
	}
};

DrawingSchema.statics.fetchLatest = function(callback){
	this.findOne({moderated:true,validated:true}, {}, { sort: { 'date' : -1 } }, callback);
}

DrawingSchema.statics.fetchTop = function(callback){
	this.random({moderated:true,validated:true,likes:{$gt:0}}, callback);
}

var Drawing = mongoose.model('Drawing', DrawingSchema);
module.exports = Drawing;