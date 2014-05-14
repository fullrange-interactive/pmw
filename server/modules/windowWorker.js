var Window 			= require('../model/window');
var WindowGroup 	= require('../model/windowGroup');
var Slide 			= require('../model/slide');
var Sequence		= require('../model/sequence')
var WindowModel 	= require('../model/windowModel');
var Config 			= require('../config');
var GroupSlide		= require('../model/groupSlide');

function WindowWorker(window,group,connection)
{
	console.log("[WindowWorker] Connection opened with window " + window.windowId);
	this.window = window;
	this.group = group;
	this.connected = true;
	this.connection = connection;
	this.lastActivity = (new Date()).getTime();
	this.lastPing = 0;
	var that = this;
	for( var i = 0; i < group.windows.length; i++ ){
		if ( group.windows[i].window.toString() == this.window._id.toString() ){
			this.groupWindow = group.windows[i];
		}
	}
	WindowModel.findById(window.windowModel, function (err, model){
		that.windowModel = model;
        that.initiateConnection();
	});
}

WindowWorker.prototype.keepAlive = function ()
{
	var now = (new Date()).getTime();
	
	/* Check if our connection hasn't timed out */
	if ( now > this.lastActivity + 1000 * Config.timeout ){
		//Whoops!
		console.log("[WindowWorker] Lost connection (timeout) to window " + this.window.windowId)
		this.terminateConnection();
	}
	
	/* Only ping in reasonable intervals so we don't choke the network */
	if ( now < this.lastPing + 1000 * Config.pingInterval ){
		return;
	}
	
	this.lastPing = (new Date()).getTime();
    try{
	    this.connection.send(JSON.stringify({type:'ping',windowId:this.window.windowId}));
    }catch (e){
        console.log("Tried to send data to client " + this.window.windowId + " but failed. Failing silently.")
    }
}

WindowWorker.prototype.handleMessage = function (message)
{
	var windowId = parseInt(message.windowId);
	if ( windowId != this.window.windowId ){
		//Ignore this message if it was incorrectly routed to us
		return;
	}
	this.lastActivity = (new Date()).getTime();
	
	if ( !this.connected ){
		console.log("[WindowWorker] Re-opened connection with window " + this.window.windowId);
		this.update();
	}
	
	if ( message.type == 'announce' ){
		this.window.privateIp = message.ip;
		this.window.connected = true;
		this.window.save();
	}else if ( message.type == 'ping' ){
		//Don't do anything
	}
}

WindowWorker.prototype.initiateConnection = function ()
{
    try{
        this.connection.send(JSON.stringify({type:'windowModel', windowModel:this.windowModel}));
    }catch(e){
        console.error("Tried to send a packet to a dead connection for window " + that.window.windowId);
        //this.terminateConnection();
    }
	
	this.update();
}

WindowWorker.prototype.terminateConnection = function ()
{
	console.log("[WindowWorker] Terminated connection with window " + this.window.windowId);
	this.connected = false;
	this.window.connected = false;
	this.window.save();
}

WindowWorker.prototype.update = function (){
	var that = this;
	WindowGroup.findById(this.group._id, function(err, group){
		for( var i = 0; i < group.windows.length; i++ ){
			if ( group.windows[i].window.toString() == that.window._id.toString() ){
				var groupWindow = group.windows[i];
                if ( groupWindow.groupSequence ){
                    GroupSequence.findById(group.windows[i].groupSequence, function(err, groupSequence){
                        if ( groupSequence != null ){
                            Sequence.findById(groupSequence.sequence).populate('sequenceEvents.slides.slide').execFind(function (err, sequences){
                                //Now we iterate through the buffer
                                var sequence = sequences[0];
                                var sendData = {
                                    type:"sequence",
                                    sequence: [],
    								xStart: groupWindow.x - groupSequence.originX,
    								yStart: groupWindow.y - groupSequence.originY,
                                    dateStart: groupSequence.dateStart	
                                };
                                sequence.sequenceEvents = sequence.sequenceEvents.sort(function (ev1,ev2){return ev1.timeAt>ev2.timeAt});
                                for ( var j = 0; j < sequence.sequenceEvents.length; j++ ){
                                    var sequenceEvent = sequence.sequenceEvents[j];
                                    for ( var k = 0; k < sequenceEvent.slides.length; k++ ){
                                        var sequenceEventSlide = sequenceEvent.slides[k];
                                        var slide = sequenceEventSlide.slide.toObject();
                                        if ( 
                                            groupWindow.x - groupSequence.originX >= sequenceEventSlide.winX 
                                            && groupWindow.x - groupSequence.originX < sequenceEventSlide.winX + slide.width
                                            && groupWindow.y - groupSequence.originY >= sequenceEventSlide.winY
                                            && groupWindow.y - groupSequence.originY < sequenceEventSlide.winY + slide.height
                                          ){
                                              slide.timeAt = sequenceEvent.timeAt;
                                              slide.winX = sequenceEventSlide.winX;
                                              slide.winY = sequenceEventSlide.winY;
                                              sendData.sequence.push(slide);
                                          }
                                    }
                                }
                                try{
                                    that.connection.send(JSON.stringify(sendData));
                                }catch(e){
                                    console.error("Tried to send a packet to a dead connection for window " + that.window.windowId);
                                    //that.terminateConnection();
                                }
                            });
                        }
                    });
                }else{
    				GroupSlide.findById(group.windows[i].groupSlide, function(err, groupSlide){
    					if ( groupSlide != null ){
    						Slide.findById(groupSlide.slide, function (err, slide){
    							var sendData = {
    								type: "slide",
    								slide: slide,
    								xStart: groupWindow.x - groupSlide.originX,
    								yStart: groupWindow.y - groupSlide.originY,
                                    dateStart: groupSlide.dateStart			
    							}
                                for(var j = 0; j < slide.relems.length; j++ ){
                                    var relem = slide.relems[j];
                                    if ( relem.type == "Drawing" ){
                                        relem.data.id = groupSlide.data.drawingIds[relem._id];
                                        console.log(relem);
                                        console.log(groupSlide.data.drawingIds);
                                    }
                                }
                                try{
    							    that.connection.send(JSON.stringify(sendData));
                                }catch(e){
                                    console.error("Tried to send a packet to a dead connection for window " + that.window.windowId);
                                    //that.terminateConnection();
                                }
    						});
    					}
    				});
                }
			}
		}
	});
}

module.exports = WindowWorker;