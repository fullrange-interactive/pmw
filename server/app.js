/**
 * DATABASE
 */
 
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
var fs = require('fs');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',function(){
    console.log("Database up and running.");
});

var relemSchema = mongoose.Schema({
    type: String, 
    data: mongoose.Schema.Types.Mixed, 
    x: Number, 
    y: Number, 
    width: Number, 
    height: Number,
    z: Number
});

var slideSchema = mongoose.Schema({
    date: {type: Date, default: Date.now},
    lastEdit: {type: Date, default: Date.now},
    name: String,
    clear: {
        type: Boolean,
        default: true
    },
    relems: [relemSchema]
});

var drawingSchema = mongoose.Schema({
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

drawingSchema.statics.random = function(query,callback) {
    var query = query;
    this.count(query,function(err, count) {
        if (err) {
            return callback(err);
        }
        var rand = Math.floor(Math.random() * count);
        this.findOne(query).skip(rand).exec(callback);
    }.bind(this));
};

var windowModelSchema = mongoose.Schema({
	columnRatios:[Number],
	lineRatios:[Number],
	maskCells:[Boolean]
});

var windowSchema = mongoose.Schema({
    slide: mongoose.Schema.ObjectId,
	sequence: mongoose.Schema.ObjectId,
    windowId: Number,
    privateIp: {type:String,default:''},
    connected: {type:Boolean,default:false}
});

var sequenceEventSchema = mongoose.Schema({
	slide: mongoose.Schema.ObjectId,
	duration: Number,
	timeAt: Number
});

var sequenceSchema = mongoose.Schema({
	name: String,
	duration: Number,
	loop: Boolean,
	sequenceEvents: [sequenceEventSchema]
});



Slide = mongoose.model('Slide', slideSchema);
Window = mongoose.model('Window', windowSchema);
Drawing = mongoose.model('Drawing', drawingSchema);
Sequence = mongoose.model('Sequence', sequenceSchema);

Slide.find(function(err,slides){
    if( err ){
        console.log("Errorr");
    }
});

windows = new Array();
Window.find().sort({windowId:1}).execFind(function(err,result){
    for(i in result){
        windows.push(result[i]);
    }
    //windows = result;
    console.log(result);
})

var intervals = [];
var timeouts = [];

clearIntervals = function(){
	for(i in intervals){
		clearInterval(intervals[i]);
	}
	for(i in timeouts){
		clearTimeout(timeouts[i]);
	}
	intervals = [];
	timeouts = [];
}

setSequenceForWindow = function setSequenceForWindowInternal(sequenceId,windowId){
	clearIntervals();
	console.log(sequenceId)
	var windowId = windowId;
    Sequence.findById(sequenceId,function(err,sequence){
        var sequence = sequence;
        for ( var i in windows ){
            if ( windows[i].windowId == windowId){
				//Go through all sequenceEvents for this sequence
				for( j = 0; j < sequence.sequenceEvents.length; j++ ){
					//This event will be played after a timeout of timeAt
					timeouts.push(setTimeout(function (ev){
						//We send the slide the first time
						console.log("change to " + ev.slide)
						setSlideForWindow(ev.slide,windowId,true);
						//..and periodically
						intervals.push(setInterval(function (ev){
							//set the slide
							console.log("change to " + ev.slide);
							setSlideForWindow(ev.slide,windowId,true);
						}, sequence.duration*1000, ev));
						
					},sequence.sequenceEvents[j].timeAt*1000,sequence.sequenceEvents[j]));
				}
                Window.findOne({windowId:windowId},function(err,window){
                    window.sequence = sequence;
                    window.save();
                })
            }
        }
    })
}

setSlideForWindow = function setSlideForWindowInternal(slideId,windowId,seq){
	if ( !seq )
		clearIntervals();
    Slide.findById(slideId,function(err,slide){
        var slide = slide;
        for ( var i in windows ){
            if ( windows[i].windowId == windowId){
                if ( windows[i].ws )
                    sendSlideToClient(slide,windows[i].ws);
                Window.findOne({windowId:windowId},function(err,window){
                    window.slide = slide;
                    window.save();
                })
                windows[i].slide = slide;
            }
        }
    })
}

/**
 * BACK OFFICE
 */

var express = require('express');
var routes = require('./routes');
var create = require('./routes/create')
var slide = require('./routes/slide')
var drawing = require('./routes/drawing')
var moderate = require('./routes/moderate')
var sequence = require('./routes/sequence')
var getAllMedia = require('./routes/getAllMedia')
var http = require('http');
var path = require('path');

var backOffice = express();
// all environments
backOffice.use(express.limit('40mb'));
backOffice.use(express.favicon(__dirname + '/public/favicon.ico')); 
backOffice.set('port', 80);
backOffice.set('views', __dirname + '/views');
backOffice.set('view engine', 'jade');
backOffice.use(express.favicon());
backOffice.use(express.logger('dev'));
backOffice.use(express.bodyParser());
backOffice.use(express.methodOverride());
backOffice.use(backOffice.router);
backOffice.use(require('stylus').middleware(__dirname + '/public'));
backOffice.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == backOffice.get('env')) {
  backOffice.use(express.errorHandler());
}

var auth = express.basicAuth('pmw', 'landwirt08');

backOffice.get('/', auth, routes.index);
backOffice.get('/slide', auth, slide.index)
backOffice.get('/getAllMedia', getAllMedia.index)
backOffice.all('/drawing', drawing.index)
backOffice.all('/create', create.index)
backOffice.all('/moderate', auth, moderate.index)
backOffice.all('/sequence', auth, sequence.index)

http.createServer(backOffice).listen(backOffice.get('port'), function(){
  console.log('Express server listening on port ' + backOffice.get('port'));
});

/**
 *CLIENTS SERVER
 */

var util = require('util');
var clients = Array();
var lastClientActivity = [];
var clientsTimeout = [];
var timeoutHandle = new Array();
var timeOutSeconds = 20;
var pingIntervalSeconds = 5;
var WebSocketServer = require('ws').Server , clientsServer = new WebSocketServer({port:8000,host:"0.0.0.0"});

function sendSlideToClient(slide, wsClient){
    console.log("sendSlide");
    slide.clear = false;
    console.log(JSON.stringify({type:'slide',slide:slide}));
    wsClient.send(JSON.stringify({type:'slide',slide:slide}),function(error){
        console.log("wsClient send finished.")
    });
}

var checkInterval = setInterval(function (){
    for(var i in windows){
        if ( windows[i].lastActivity != undefined && windows[i].lastActivity != null ){
            if ( windows[i].lastActivity+timeOutSeconds*1000 < (new Date()).getTime() ){
                windows[i].connected = false;
                windows[i].ws = null;
                console.log("Lost connection to window " + windows[i].windowId);
            }else if ( windows[i].ws != null ){
                windows[i].ws.send(JSON.stringify({type:'ping'}), function (error){
                    if ( error ){
                        console.log("Lost connection to window " + windows[i].windowId);
                        windows[i].ws = null;
                        windows[i].connected = false;
                    }
                });
            }
        }
    }
}, pingIntervalSeconds * 1000);

clientsServer.on('connection', function(client) {
        
    console.log("Opened connection");
    
    
    client.on('message',function(message){
        
        var parsedMessage = JSON.parse(message);
        console.log(message);
        if ( parsedMessage.type == 'announce' ){
            var windowId = parseInt(parsedMessage.windowId);
            //var windowId = parseInt(message);
            lastClientActivity[windowId]     = new Date().getTime();
        
            Window.findOne({windowId:windowId},function(error,window){
                Slide.findById(window.slide,function(error,slide){
                    sendSlideToClient(slide,client);
                    for(i in windows){
                        if ( windows[i].windowId == windowId ){
                            if ( windows[i].ws != null ){
                                windows[i].ws.close(function (error){
                                    if ( error )
                                        console.log("Error closing window " + windowId);
                                    console.log("Re-opened connection for window " + windowId);
                                });
                                windows[i].ws = null;
                            }
                            windows[i].ws = client;
                            windows[i].connected = true;
                            windows[i].privateIp = parsedMessage.ip;
                            windows[i].lastActivity = (new Date()).getTime();
                        }
                    }
                })
            }); 
        } else if ( parsedMessage.type == 'ping' ){
            for ( i in windows ){
                if ( windows[i].windowId == parsedMessage.windowId ){
                    windows[i].lastActivity = (new Date()).getTime();
                }
            }
        }     
    });
    /*
    client.on('close',function(){
        console.log("[close] closed conenction");  
        clearTimeout(timeoutHandle[client.windowId]);
    });*/
});

clientsServer.on('error', function(ws) {
    console.log("[error] closed connection "+ws);
});
