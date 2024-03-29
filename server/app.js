var numIntervals = 0;
setIntervalPMWWRAPPER = function (fun, delay) {
    var retVal = setInterval(fun, delay);
    console.log("=> New interval " + retVal + ", total = " + (++numIntervals));
    return retVal;
}

clearIntervalPMWWRAPPER = function (id) {
    console.log("=> Deleted interval " + id + ", total = " + (--numIntervals));
    return clearInterval(id);
}


/**
 * DATABASE
 */
Configuration = require('./config');
Slide = require('./model/slide');
Drawing = require('./model/drawing');
Window = require('./model/window');
Sequence = require('./model/sequence');
User = require('./model/user');
Automator = require('./model/automator');
WindowModel = require('./model/windowModel');
WindowGroup = require('./model/windowGroup');
GroupSlide = require('./model/groupSlide');
GroupSequence = require('./model/groupSequence')
Folder = require('./model/folder');
Poll = require('./model/poll');
Option = require('./model/option');

/**
 * MODULES
 */

SlideManager = require('./modules/slideManager');
WindowServer = require('./modules/windowServer');
WindowWorker = require('./modules/windowWorker');
AutomatorManager = require('./modules/automatorManager');
AutomatorWorker = require('./modules/automatorWorker');
LiveDrawingManager = require('./modules/liveDrawingManager')

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
var fs = require('fs');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',function(){
    console.log("Database up and running.");
});

/**
 * BACK OFFICE
 */

var passport = require("passport")
var LocalStrategy = require("passport-local").Strategy;

var express = require('express');
var routes = require('./routes');
var createRoute = require('./routes/create');
var slideRoute = require('./routes/slide');
var drawingRoute = require('./routes/drawing');
var tmpDrawingRoute = require('./routes/tmpDrawing');
var moderateRoute = require('./routes/moderate');
var sequenceRoute = require('./routes/sequence');
var uploadRoute = require('./routes/upload');
var getAllMediaRoute = require('./routes/getAllMedia');
var monitoringRoute = require('./routes/monitoring');
var rendererRoute = require('./routes/renderer');
var signupRoute = require('./routes/signup');
var loginRoute = require('./routes/login');
var newWindowRoute = require('./routes/newWindow');
var windowModelRoute = require('./routes/windowModel');
var automatorRoute = require('./routes/automator');
var configRoute = require('./routes/config');
var photoRoute = require('./routes/photo');
var vjingRoute = require('./routes/vjing');
var galleryRoute = require('./routes/gallery');
var fireworksRoute = require('./routes/fireworks');
var drawingLiveRoute = require('./routes/drawingLive');
var screenshotRoute = require('./routes/screenshot');
var postPhotoRoute = require('./routes/postPhoto');
var bcvsGalleryRoute = require('./routes/bcvsGallery');
var pollRoute = require('./routes/poll');
var optionRoute = require('./routes/option');
var schedulerRoute = require('./routes/scheduler');
var http = require('http');
var path = require('path');

var multer = require("multer");
var uploader = multer({dest:"./uploads/"});

var backOffice = express();
// all environments
backOffice.set('env', 'development');
backOffice.use(express.limit('1024mb'));
backOffice.use(express.favicon(__dirname + '/public/favicon.ico')); 
backOffice.set('port', Configuration.port);
backOffice.set('views', __dirname + '/views');
backOffice.set('view engine', 'jade');
backOffice.use(express.favicon());
backOffice.use(express.logger('dev'));
backOffice.use(express.cookieParser());
backOffice.use(express.json());
backOffice.use(express.urlencoded());
backOffice.use("/upload", express.multipart());
// backOffice.use("/photo", express.multipart());
backOffice.use("/photo", uploader)
//backOffice.use(express.bodyParser());
backOffice.use("/screenshot", uploader);
backOffice.use("/postPhoto", uploader);
backOffice.use(express.session({secret:'hRUpyp6YbzB546BIBqHt3yLoxWjt6xsS/yyafNH5F4A'}));
backOffice.use(express.methodOverride());
backOffice.use(require('stylus').middleware(__dirname + '/public'));
backOffice.use('/photos-bcvs', function (req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    return next();
});
backOffice.use('/tmp-drawings', function (req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    return next();
});
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
backOffice.get('/getAllMedia', User.isAuthenticated, getAllMediaRoute.index)
backOffice.all('/create', User.isAuthenticated, createRoute.index)
backOffice.all('/moderate', User.isAuthenticated, moderateRoute.index)
backOffice.all('/sequence', User.isAuthenticated, sequenceRoute.index)
backOffice.all('/upload', User.isAuthenticated, uploadRoute.index)
backOffice.all('/window', User.isAuthenticated, newWindowRoute.index)
backOffice.all('/windowModel', windowModelRoute.index)
backOffice.all('/config', User.isAuthenticated, configRoute.index)
backOffice.all('/automator', User.isAuthenticated, automatorRoute.index)
backOffice.all('/scheduler', User.isAuthenticated, schedulerRoute.index);
backOffice.get('/slide', slideRoute.index)
backOffice.options('/drawing', function (req, res) {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Content-Type");
    res.end();
});
backOffice.get('/drawing', drawingRoute.index)
backOffice.post('/drawing', drawingRoute.index)
backOffice.options('/tmpDrawing', function (req, res) {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Content-Type");
    res.end();
});
backOffice.post('/tmpDrawing', tmpDrawingRoute.index);
backOffice.all('/photo', uploader.single('file'), photoRoute.index)
backOffice.all('/vjing', vjingRoute.index)
backOffice.all('/gallery', galleryRoute.index);
backOffice.all('/fireworks', fireworksRoute.index)
backOffice.get('/login', loginRoute.index)
backOffice.all('/monitoring', monitoringRoute.index)
backOffice.all('/renderer', rendererRoute.index)
backOffice.all('/drawingLive', drawingLiveRoute.index)
backOffice.all('/screenshot', uploader.single('file'), screenshotRoute.index)
backOffice.all('/postPhoto', uploader.single('file'), postPhotoRoute.index)
backOffice.all('/bcvsGallery', bcvsGalleryRoute.index)
backOffice.all('/poll', pollRoute.index)
backOffice.get('/option', optionRoute.index);
backOffice.post('/login', 
    passport.authenticate('local',{
        successRedirect : "/",
        failureRedirect : "/login",
    })
);
backOffice.all('/signup', signupRoute.index)
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

Server = new WindowServer(Configuration.serverPort);
Manager = new SlideManager(Server);

/**
 *AUTOMATORS
 */
AutomatorManagerInstance = new AutomatorManager(Manager);
LiveDrawingManagerInstance = new LiveDrawingManager(Configuration.liveDrawingPort);