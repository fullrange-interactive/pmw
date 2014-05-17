var Window 			= require('../model/window');
var WindowGroup 	= require('../model/windowGroup');
var Slide 			= require('../model/slide');
var Sequence		= require('../model/sequence');
var WindowWorker	= require('./windowWorker');
var Config			= require('../config');
var WebSocketServer = require('ws').Server;

function WindowServer(port)
{
	this.port = port;
	this.server = new WebSocketServer({port:this.port,host:'0.0.0.0'});
	this.server.parent = this;
	this.server.on('connection',this.onConnection);
	this.workers = [];
	this.keepAliveInterval = setInterval(this.keepAlive.bind(this), Config.pingInterval * 1000)
}

WindowServer.prototype.getWorkerForWindowId = function (windowId)
{
	for ( var i in this.workers ){
		if ( this.workers[i].window.windowId == windowId ){
			return this.workers[i];
		}
	}
	return null;
}

WindowServer.prototype.getWorkerForConnection = function (connection)
{
	for ( var i in this.workers ){
		if ( this.workers[i].connection == connection ){
			return this.workers[i];
		}
	}
	return null;	
}

WindowServer.prototype.onConnection = function (connection)
{
	var that = this.parent;
	
    connection.on('message',function(message){
        that.onMessage(that,connection,message);
    });

    connection.on('close',function (){
    	that.onClose(that,connection)
    });
}

WindowServer.prototype.onMessage = function (that, connection, message){
    var parsedMessage = JSON.parse(message);
    console.log("[WindowServer] Received message: " + message);
	
    var windowId = parseInt(parsedMessage.windowId);        
    var worker = that.getWorkerForWindowId(windowId);
	
    if ( parsedMessage.type == 'announce' ){
		if ( worker == null ){
			//This worker does not exist already
			Window.findOne({windowId:windowId}, function(err, window){
				if ( err ){
					console.error("[Error] No window with windowId " + windowId);
					return;
				}
				var groupId = null;
				WindowGroup.find({}, function(err, groups){
					for( var i in groups ){
						for ( var j = 0; j < groups[i].windows.length; j++ ){
							if ( groups[i].windows[j].window.toString() == window._id.toString() ){
								var newWorker = new WindowWorker(window,groups[i],connection);
								that.workers.push(newWorker);
								newWorker.handleMessage(parsedMessage);
								break;
							}
						}
					}
					for ( var j = 0; j < that.workers.length; j++ ){
						that.workers[j].sendNeighbors(that.workers);
					}
				});
			});
		}
	}
	if ( worker != null ){
		worker.handleMessage(parsedMessage);
	}
}

WindowServer.prototype.onClose = function (that, connection){
    var worker = that.getWorkerForConnection(connection);
	if ( worker != null ){
		console.log("[WindowServer] Closed connection (clean) to window " + worker.window.windowId);
		worker.terminateConnection();
		that.workers.splice(that.workers.indexOf(worker),1);
	}
}

WindowServer.prototype.keepAlive = function (){
	var now = (new Date()).getTime();
	for( var i in this.workers ){
		var worker = this.workers[i];
		if ( worker.connected ){
			worker.keepAlive();
		}else{
			if ( now > worker.lastActivity + Config.workerLifeSpan * 1000 ){
				//We kill the son of a bitch
				console.log("[WindowServer] Killing WindowWorker for window " + worker.window.windowId);
				this.workers.splice(this.workers.indexOf(worker),1);
			}
		}
	}
}

module.exports = WindowServer;