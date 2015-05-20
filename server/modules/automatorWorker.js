var Window 			= require('../model/window');
var WindowGroup 	= require('../model/windowGroup');
var Automator 		= require('../model/automator');
var Slide 			= require('../model/slide');
var Sequence		= require('../model/sequence');
var Config			= require('../config');

var globalUpdateInterval = 100;
var defaultDuration = 10000;

function AutomatorWorker(automator, group, slideManager){
	this.automator = automator;
	this.group = group;
	this.slideManager = slideManager;
	this.elementsQueue = [];
	this.collectionWorkers = [];
	this.lastSend = 0;
	this.mapWidth = this.group.getWidth();
	this.mapHeight = this.group.getHeight();
	this.windowMap = makeArray([this.mapWidth,this.mapHeight]);
	for ( var x = 0; x < this.mapWidth; x++ ){
		for ( var y = 0; y < this.mapHeight; y++ ){
			this.windowMap[x][y] = 0;
		}
	}
	for ( var i = 0; i < automator.collections.length; i++ ){
		this.collectionWorkers.push(new CollectionWorker(this, automator.collections[i]));
	}
	this.updateInterval = null;
}

var makeArray = function (dims, arr) {          
    if (dims[1] === undefined) {
        return new Array(dims[0]);
    }

    arr = new Array(dims[0]);

    for (var i=0; i<dims[0]; i++) {
        arr[i] = new Array(dims[1]);
        arr[i] = makeArray(dims.slice(1), arr[i]);
    }

    return arr;
}

function fitRectInArray(automatorWorker, width, height){
	var possibleXYValues = [];
	for(var x = 0; x < automatorWorker.mapWidth; x++){
		for(var y = 0; y < automatorWorker.mapHeight; y++){
			if ( automatorWorker.windowMap[x][y] <= 0 ){
				if ( x+width <= automatorWorker.mapWidth && y+height <= automatorWorker.mapHeight ){
					var isOkay = true;
					for (var x2 = 0; x2 < width; x2++){
						for ( var y2 = 0; y2 < height; y2++ ){
							if ( automatorWorker.windowMap[x+x2][y+y2] > 0 ){
								isOkay = false;
							}
						}
					}
					if ( isOkay ){
						possibleXYValues.push({x:x,y:y});
					}
				}
			}
		}
	}
	return possibleXYValues;
}

AutomatorWorker.prototype.addElementToQueue = function (elementId, data){
	this.elementsQueue.push(new QueueElement(elementId, data, this));
}

AutomatorWorker.prototype.update = function (){
	//The time passes for every window in the map
	for ( var x = 0; x < this.mapWidth; x++ ){
		for ( var y = 0; y < this.mapHeight; y++ ){
			this.windowMap[x][y] -= globalUpdateInterval;
		}
	}
	for ( var i = 0; i < this.elementsQueue.length; i++ ){
		var element = this.elementsQueue[i];
		if ( element.isSent ){
			this.elementsQueue.splice(i,1);
			i--;
			break;
		}
		element.doAfterFullLoad((function(element){
			var possibilities = fitRectInArray(this, element.fullElement.width, element.fullElement.height, defaultDuration);
			if ( possibilities.length > 0 ){
				var chosenOne = Math.floor(Math.random()*possibilities.length);
				var res = possibilities[chosenOne];
				for(var x = res.x; x < res.x + element.fullElement.width; x++ ){
					for(var y = res.y; y < res.y + element.fullElement.height; y++ ){
						this.windowMap[x][y] = defaultDuration;
					}
				}
				element.sendToWindow(possibilities[chosenOne].x, possibilities[chosenOne].y, "smoothLeft");
				element.isSent = true;
			}
		}).bind(this,element));
	}
}

AutomatorWorker.prototype.start = function(){
	if ( this.updateInterval == null ){
		this.updateInterval = setInterval(this.update.bind(this), globalUpdateInterval);
	}
	for ( var i = 0; i < this.collectionWorkers.length; i++ ){
		var worker = this.collectionWorkers[i];
		worker.start();
	} 
}

AutomatorWorker.prototype.stop = function (){
	for ( var worker in this.collectionWorkers ){
		this.collectionWorkers[worker].stop();
	}
	clearInterval(this.updateInterval);
}

function CollectionWorker(automatorWorker, collection){
	this.automatorWorker = automatorWorker;
	console.log("new collection worker collection=" + collection)
	this.collection = collection;
	this.updateInterval = null;
}

CollectionWorker.prototype.start = function (){
	if ( this.updateInterval == null ){
		var that = this;
		this.updateInterval = setInterval(this.update.bind(this), this.collection.period);
	}
}

CollectionWorker.prototype.stop = function (){
	clearInterval(this.updateInterval);
}

CollectionWorker.prototype.update = function (){
	if ( this.collection.type == "random" ){
		this.collection.collectionElements = shuffle(this.collection.collectionElements);
		for ( var i = 0; i < this.collection.collectionElements.length; i++ ){
			var collectionElement = this.collection.collectionElements[i];
			if ( Math.random() < collectionElement.data.probability ){
				this.automatorWorker.addElementToQueue(collectionElement.element);
				return;
			}
		}
	}
}

function QueueElement(elementId, data, automatorWorker){
	this.elementId = elementId;
	this.data = data;
	this.automatorWorker = automatorWorker;
	this.fullElement = null;
	this.isSent = false;
	var that = this;
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

QueueElement.prototype.sendToWindow = function (x,y,transition){
	console.log("I am sending!")
	this.automatorWorker.slideManager.setGroupSlideForXY(this.elementId, this.automatorWorker.group._id, x, y, transition, this.data);
}

QueueElement.prototype.doAfterFullLoad = function(callback){
	Slide.findById(this.elementId,(function(err, slide){
		if ( err ){
			Sequence.findById(this.elementId,(function(err, sequence){
				this.fullElement = sequence;
				callback();
			}).bind(this))
			return;
		}
		this.fullElement = slide;
		callback();
	}).bind(this))
}

module.exports = AutomatorWorker;