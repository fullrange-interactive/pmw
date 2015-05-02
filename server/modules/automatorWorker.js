var Window 			= require('../model/window');
var WindowGroup 	= require('../model/windowGroup');
var Automator 		= require('../model/automator');
var Slide 			= require('../model/slide');
var Sequence		= require('../model/sequence');
var Config			= require('../config');

var globalUpdateInterval = 1000;
var defaultDuration = 2000;

function AutomatorWorker(automator, group, slideManager){
	this.automator = automator;
	this.group = group;
	this.slideManager = slideManager;
	this.elementsQueue = [];
	this.collectionWorkers = [];
	this.lastSend = 0;
	for ( var i = 0; i < automator.collections.length; i++ ){
		this.collectionWorkers.push(new CollectionWorker(this, automator.collections[i]));
	}
	this.updateInterval = null;
}

AutomatorWorker.prototype.addElementToQueue = function (elementId){
	this.elementsQueue.push(new QueueElement(elementId, {}, this));
}

AutomatorWorker.prototype.update = function (){
	this.lastSend += globalUpdateInterval;
	if ( this.lastSend > defaultDuration && this.elementsQueue.length > 0 ){
		this.lastSend = 0;
		var element = this.elementsQueue.splice(0,1)[0];
		element.sendToWindow(Math.floor(Math.random()*this.group.width),Math.floor(Math.random()*this.group.height),"none");
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