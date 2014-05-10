/**
 * DATABASE
 */
Configuration = require('./config');
Slide = require('./model/slide');
Drawing = require('./model/drawing');
Window = require('./model/window');
Sequence = require('./model/sequence');
User = require('./model/user');
WindowModel = require('./model/windowModel');
WindowGroup = require('./model/windowGroup');
SlideManager = require('./modules/slideManager');
WindowServer = require('./modules/windowServer');
WindowWorker = require('./modules/windowWorker');
GroupSlide = require('./model/groupSlide');
GroupSequence = require('./model/groupSequence')

var mongoose = require('mongoose');
mongoose.connect('mongodb://baleinev.ch/test');
var db = mongoose.connection;
var fs = require('fs');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',function(){
    console.log("Database up and running.");
});

/*
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
*/

/**
 * BACK OFFICE
 */

var passport = require("passport")
var LocalStrategy = require("passport-local").Strategy;

var express = require('express');
var routes = require('./routes');
var create = require('./routes/create')
var slide = require('./routes/slide')
var drawing = require('./routes/drawing')
var moderate = require('./routes/moderate')
var sequence = require('./routes/sequence')
var upload = require('./routes/upload')
var getAllMedia = require('./routes/getAllMedia')
var monitoring = require('./routes/monitoring')
var signup = require('./routes/signup')
var login = require('./routes/login')
var newWindow = require('./routes/newWindow');
var windowModelRoute = require('./routes/windowModel');
var config = require('./routes/config');
var http = require('http');
var path = require('path');

var backOffice = express();
// all environments
backOffice.set('env', 'development');
backOffice.use(express.limit('40mb'));
backOffice.use(express.favicon(__dirname + '/public/favicon.ico')); 
backOffice.set('port', Configuration.port);
backOffice.set('views', __dirname + '/views');
backOffice.set('view engine', 'jade');
backOffice.use(express.favicon());
backOffice.use(express.logger('dev'));
backOffice.use(express.cookieParser());
backOffice.use(express.bodyParser());
backOffice.use(express.session({secret:'hRUpyp6YbzB546BIBqHt3yLoxWjt6xsS/yyafNH5F4A'}));
backOffice.use(express.methodOverride());
backOffice.use(require('stylus').middleware(__dirname + '/public'));
backOffice.use(express.static(path.join(__dirname, 'public')));
backOffice.use(passport.initialize());
backOffice.use(passport.session());
backOffice.use(backOffice.router);

//Passport shit
passport.use(User.strategy);
passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);

var auth = passport.authenticate('local',{failureRedirect:'/login'});
//var auth = express.basicAuth('pmw', 'landwirt08');

// development only
if ('development' == backOffice.get('env')) {
  backOffice.use(express.errorHandler());
}

backOffice.get('/', User.isAuthenticated, routes.index);
backOffice.get('/slide', slide.index)
backOffice.get('/getAllMedia', User.isAuthenticated, getAllMedia.index)
backOffice.all('/drawing', drawing.index)
backOffice.all('/create', User.isAuthenticated, create.index)
backOffice.all('/moderate', User.isAuthenticated, moderate.index)
backOffice.all('/sequence', User.isAuthenticated, sequence.index)
backOffice.all('/upload', User.isAuthenticated, upload.index)
backOffice.all('/window', User.isAuthenticated, newWindow.index)
backOffice.all('/windowModel', User.isAuthenticated, windowModelRoute.index)
backOffice.all('/config', User.isAuthenticated, config.index)
backOffice.all('/monitoring', monitoring.index)
backOffice.get('/login', login.index)
backOffice.post('/login', 
	passport.authenticate('local',{
		successRedirect : "/",
		failureRedirect : "/login",
	})
);
backOffice.all('/signup', signup.index)
backOffice.get('/logout', function(req, res){
	req.logout();
	res.redirect('/login');
});

http.createServer(backOffice).listen(backOffice.get('port'), function(){
  console.log('Express server listening on port ' + backOffice.get('port'));
});

/**
 *CLIENTS SERVER
 */

var util = require('util');

var Server = new WindowServer(Configuration.serverPort);
Manager = new SlideManager(Server);

//var WebSocketServer = require('ws').Server , clientsServer = new WebSocketServer({port:8000,host:"0.0.0.0"});

/*
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
*/

