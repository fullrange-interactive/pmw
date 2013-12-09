/**
 * DATABASE
 */
 
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;

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
    name: String,
    clear: {
        type: Boolean,
        default: true
    },
    relems: [relemSchema]
});

var strokeSchema = mongoose.Schema({
    points:[{x:Number, y:Number}],
    color: String,
    lineWidth: Number
})

var drawingSchema = mongoose.Schema({
    date: {type: Date, default: Date.now},
    backgroundColor: String,
    width: Number,
    height: Number,
    points: Number,
    strokes: [strokeSchema]
});

drawingSchema.statics.random = function(callback) {
  this.count(function(err, count) {
    if (err) {
      return callback(err);
    }
    var rand = Math.floor(Math.random() * count);
    this.findOne().skip(rand).exec(callback);
  }.bind(this));
};

var windowSchema = mongoose.Schema({
    slide: mongoose.Schema.ObjectId,
    windowId: Number
})

Slide = mongoose.model('Slide', slideSchema);
Window = mongoose.model('Window', windowSchema);
Drawing = mongoose.model('Drawing', drawingSchema);
Stroke = mongoose.model('Stroke',strokeSchema);

Slide.find(function(err,slides){
    if( err ){
        console.log("Errorr");
    }
});

windows = new Array();
Window.find(function(err,result){
    windows = result;
    console.log(result);
})

setSlideForWindow = function setSlideForWindowInternal(slideId,windowId){
    Slide.findById(slideId,function(err,slide){
        var slide = slide;
        for ( var i in windows ){
            console.log("window "+ i);
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
var getAllMedia = require('./routes/getAllMedia')
var http = require('http');
var path = require('path');

var backOffice = express();
// all environments
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
var WebSocketServer = require('ws').Server , clientsServer = new WebSocketServer({port:8080,host:"0.0.0.0"});

function sendSlideToClient(slide, wsClient){
    console.log("sendSlide");
    console.log(JSON.stringify(slide));
    wsClient.send(JSON.stringify(slide),function(error){
        console.log("wsClient send finished.")
    });
}

clientsServer.on('connection', function(client) {
        
    console.log("Opened connection");
    
    
    client.on('message',function(message){
        
        var windowId = parseInt(message);
        
        clients[windowId]                = client;
        clientsTimeout[windowId]         = false;
        lastClientActivity[windowId]     = new Date().getTime();
        
        Window.findOne({windowId:windowId},function(error,window){
            Slide.findById(window.slide,function(error,slide){
                console.log("sending slide");
                sendSlideToClient(slide,client);
                for(i in windows){
                    if ( windows[i].windowId == windowId ){
                        windows[i].ws = client;
                    }
                }
            })
        });        
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


/*
 * UDP ping server
 */
/*
var host        = "192.168.3.4", port = 8081;
var dgram       = require( "dgram" );
var server      = dgram.createSocket( "udp4" );

server.on( "message", function( msg, rinfo )
{
    lastClientActivity[parseInt(msg)] = new Date().getTime();
    server.send( msg, 0, msg.length, 8082, rinfo.address);
});
server.on("error", function () {});
server.bind( port, host );

/*
 * Watchdog
 */
 /*
setInterval(function()
{
    var now = new Date().getTime();
    
    for(var i in clients)
    {
        var lastActivity = now - lastClientActivity[i];

        if(lastActivity > 5000 && !clientsTimeout[i])
        {
            clientsTimeout[i] = true;
            console.log("[Hearthbeat] Connection lost");
            
            clearTimeout(timeoutHandle[i]);
            
            if(clients[i])
                clients[i].close();
        }
        else if(lastActivity <= 5000)
        {
            if(clientsTimeout[i])
            {
              console.log("[Hearthbeat] Client "+i+" resurrected! Alleluiah!");
            }
           clientsTimeout[i] = false;   
        }
    }
},1000);
*/