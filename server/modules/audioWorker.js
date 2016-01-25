var Window      = require('../model/window');
var WindowGroup   = require('../model/windowGroup');
var Slide       = require('../model/slide');
var Sequence    = require('../model/sequence')
var WindowModel   = require('../model/windowModel');
var Config      = require('../config');
var GroupSlide    = require('../model/groupSlide');

function AudioWorker(connection){
    console.log("[WindowWorker] Connection opened with audio client");
    this.connected = true;
    this.connection = connection;
    this.lastActivity = (new Date()).getTime();
    this.lastPing = 0;
    this.privateIp = '';
}

AudioWorker.prototype.keepAlive = function (){
    var now = (new Date()).getTime();
    
    /* Check if our connection hasn't timed out */
    if ( now > this.lastActivity + 1000 * Config.timeout ){
        //Whoops!
        console.log("[WindowWorker] Lost connection (timeout) to audio client")
        this.terminateConnection();
    }
    
    /* Only ping in reasonable intervals so we don't choke the network */
    if ( now < this.lastPing + 1000 * Config.pingInterval ){
        return;
    }
    
    this.lastPing = (new Date()).getTime();
        try{
            this.connection.send(JSON.stringify({type:'ping',windowId:'audio'}));
        }catch (e){
                console.log("Tried to send data to audio client but failed. Failing silently.")
        }
}

AudioWorker.prototype.handleMessage = function (message){
    var windowId = message.windowId;
    if ( windowId != 'audio' ){
        //Ignore this message if it was incorrectly routed to us
        return;
    }
    this.lastActivity = (new Date()).getTime();
    
    if ( !this.connected ){
        console.log("[WindowWorker] Re-opened connection with audio client");
    }
    
    if ( message.type == 'announce' ){
        this.privateIp = message.ip;
        this.connected = true;
    }else if ( message.type == 'ping' ){
        //Don't do anything
    }
}

AudioWorker.prototype.initiateConnection = function (){
    /*
        try{
                this.connection.send(JSON.stringify({type:'windowModel', windowModel:this.windowModel, x:this.groupWindow.x,y:this.groupWindow.y}));
        }catch(e){
                console.error("Tried to send a packet to a dead connection for window " + that.window.windowId);
                //this.terminateConnection();
        }
    */
    //this.update();
}

AudioWorker.prototype.sendAudio = function(name,date){
    var sendData = {
        type: 'audio',
        audio: {
            file: name
        },
        dateStart: date
    }
    try{
        this.connection.send(JSON.stringify(sendData));
    }catch(e){
        console.error("Tried to send a packet to a dead connection for audio client");
    }
}

AudioWorker.prototype.terminateConnection = function (){
    console.log("[WindowWorker] Terminated connection with audio client");
    this.connected = false;
}

AudioWorker.prototype.sendNeighbors = function (workers){
    var sendData = {type:'neighbors',neighbors:[]};
    for( var i in workers ){
        var worker = workers[i];
        //console.log(worker.group._id.toString() + " " + this.group._id.toString())
        if ( worker.group._id.toString() == this.group._id.toString() ){
            //console.log("ok!");
            sendData.neighbors.push({ip:worker.window.privateIp, x:worker.groupWindow.x, y:worker.groupWindow.y});
        }
    }
    try{
        this.connection.send(JSON.stringify(sendData));
    }catch ( e ){
        console.error("Tried to send a packet to a dead connection for audio client");
    }
}

module.exports = AudioWorker;