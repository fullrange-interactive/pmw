var Window 			= require('../model/window');
var WindowGroup 	= require('../model/windowGroup');
var Automator 		= require('../model/automator');
var Slide 			= require('../model/slide');
var Sequence		= require('../model/sequence');
var Config			= require('../config');

var globalUpdateInterval = 1000;
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

function fitRectInArray(automatorWorker, width, height, minimumValue){
	var possibleXYValues = [];
	minimumValue = typeof minimumValue !== 'undefined' ?  minimumValue : defaultDuration;
	for(var x = 0; x < automatorWorker.mapWidth; x++){
		for(var y = 0; y < automatorWorker.mapHeight; y++){
			if ( automatorWorker.windowMap[x][y] >= minimumValue ){
				if ( x+width < automatorWorker.mapWidth && y+height < automatorWorker.mapHeight ){
					var isOkay = true;
					for (var x2 = 0; x2 < width; x2++){
						for ( var y2 = 0; y2 < height; y2++ ){
							if ( automatorWorker.windowMap[x+x2][y+y2] < minimumValue ){
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

AutomatorWorker.prototype.addElementToQueue = function (elementId){
	this.elementsQueue.push(new QueueElement(elementId, {}, this));
}

AutomatorWorker.prototype.update = function (){
	this.lastSend += globalUpdateInterval;
	//The time passes for every window in the map
	for ( var x = 0; x < this.mapWidth; x++ ){
		for ( var y = 0; y < this.mapHeight; y++ ){
			this.windowMap[x][y] += 1000;
		}
	}
	if ( /* this.lastSend > defaultDuration && */ this.elementsQueue.length > 0 ){
		this.lastSend = 0;
		var element = this.elementsQueue[0];
		var possibilities = fitRectInArray(this, 1, 1, defaultDuration);
		if ( possibilities.length > 0 ){
			var chosenOne = Math.floor(Math.random()*possibilities.length);
			element.sendToWindow(possibilities[chosenOne].x, possibilities[chosenOne].y, "smoothLeft");
			this.elementsQueue.splice(0,1);
		}
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
	this.automatorWorker.slideManager.setGroupSlideForXY(this.elementId, this.automatorWorker.group._id, x, y, transition);
}

module.exports = AutomatorWorker;