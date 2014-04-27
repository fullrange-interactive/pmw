#!/usr/bin/env node-canvas
/*jslint indent: 2, node: true */
"use strict";
 
GLOBAL.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
GLOBAL.parseBool = function(value) {
    if(typeof value ==="boolean")
        return value;
    return (typeof value === "undefined") ? 
           false : 
           // trim using jQuery.trim()'s source 
           value.replace(/^\s+|\s+$/g, "").toLowerCase() === "true";
}

/*
 * Relem unique instance number, shared along every relem.
 */
GLOBAL.instance         = 0;
/*
 * mainGrid unique instance, available from everywhere
 */
GLOBAL.mainGrid         = false;



var modulesPath         = '/home/pi/pmw/client/node/node_modules/';
var openvgCanvasPath    = modulesPath+'openvg-canvas/';
var relemsPath          = '/home/pi/pmw/client/node/relems/';
var transitionsPath     = '/home/pi/pmw/client/node/transitions/';

var screenWidth         = 1366;
var screenHeight        = 768;

var sys                 = require('sys')
var exec                = require('child_process').exec;

var connectedScreenResolution   = new Array(1024,768);

GLOBAL.configOptions    = require('/home/pi/config.json');

screenWidth             = configOptions.connectedScreenResolution[0];
screenHeight            = configOptions.connectedScreenResolution[1];

var windowId            = configOptions.windowId;

console.log("[Client] Screen dimensions: "+screenWidth+" x "+screenHeight);

var exiting             = false;
    
console.log("[Client] windowd "+windowId);

var currentSlide        = {lastEdit:(new Date()),_id:0};

var serverIp            = configOptions.controlServerIp;
var serverPort          = configOptions.controlServerPort;
var availableRelems     = {};
var availableTransitions= {};

var Class               = require('/home/pi/pmw/client/node/class.js').Class;
var base_rElem          = Class.extend(require('/home/pi/pmw/client/node/relem.js').rElem);
var base_transition     = Class.extend(require('/home/pi/pmw/client/node/transition.js').transition);

var fs                  = require('fs');
var path                = require('path');

var relemsFiles         = fs.readdirSync(relemsPath);

for(var i in relemsFiles)
  /*
   * Include all js files from the rElems dir
   */
  if(path.extname(relemsFiles[i]) == '.js')
  {
     var new_rElem                      = require(relemsPath+relemsFiles[i]).class;
     availableRelems[new_rElem.type]    = base_rElem.extend(new_rElem);
     console.log('[Startup] rElem ['+new_rElem.type+'] available ');
  }
  
var transitionFiles                     = fs.readdirSync(transitionsPath);

for(var i in transitionFiles)
  /*
   * Include all js files from the transitions dir
   */
  if(path.extname(transitionFiles[i]) == '.js')
  {
     var new_transition                      = require(transitionsPath+transitionFiles[i]).class;
     availableTransitions[new_transition.type]    = base_transition.extend(new_transition);
     console.log('[Startup] transition ['+new_transition.type+'] available ');
  }

GLOBAL.MediaServer = new (require('/home/pi/pmw/client/node/mediaServer.js').mediaServer)();
  
var rElemGrid   = require('/home/pi/pmw/client/node/rElemGrid.js').rElemGrid;

GLOBAL.Canvas   = require(openvgCanvasPath+'lib/canvas');
var canvas      = new Canvas(screenWidth,screenHeight,0);
var ctx         = canvas.getContext('2d');

// ctx.setGlobalAlpha(0);


/*
 * Window physical propreties
 */
// var gridWidth               = 9;
// var gridHeight              = 5;
// 
// var windowGlobalWidth       = 175;
// var windowGlobalHeight      = 92;
// 
// var topBottomSeparator      = 16;
// 
// var rowSeparator            = 3.8;
// var columnSeparator         = 3.8;
// 
// var subTopWindowHeight      = 15;
// var subWindowHeight         = 29;
// var subWindowWidth          = 31.6;

// var offset               = {left:54,top:205,right:46,bottom:0};

var offset               = {left:0,top:0,right:0,bottom:0};

/***---------------------------***/
/*
var subWindowWidthRatio     = subWindowWidth                /windowGlobalWidth;
var columnSeparatorRatio    = columnSeparator               /windowGlobalWidth;

var topRowHeightRatio       = subTopWindowHeight            /windowGlobalHeight;
var rowSeparatorRatio       = rowSeparator                  /windowGlobalHeight;
var subWindowHeightRatio    = subWindowHeight               /windowGlobalHeight;
var topBottomSeparatorRatio = topBottomSeparator           /windowGlobalHeight;*/

// 100 * 84
// 
// 49
// 
// 84
// 
// 16*2
// 13*3

                    
// mainGrid = new rElemGrid(
//                             availableRelems,
//                            {w:screenWidth,h:screenHeight},
//                            {w:gridWidth,h:gridHeight},      
//                             windowGlobalWidth/windowGlobalHeight,
//                             screenWidth/screenHeight,
//                             new Array(
//                                 subWindowWidthRatio,
//                                 columnSeparatorRatio,
//                                 subWindowWidthRatio,
//                                 columnSeparatorRatio,
//                                 subWindowWidthRatio,
//                                 columnSeparatorRatio,
//                                 subWindowWidthRatio,
//                                 columnSeparatorRatio,
//                                 subWindowWidthRatio),
//                             new Array(
//                                 topRowHeightRatio,
//                                 rowSeparatorRatio,
//                                 subWindowHeightRatio,
//                                 topBottomSeparatorRatio,
//                                 subWindowHeightRatio),
//                            new Array(
//                                false,
//                                true,
//                                false,
//                                true,
//                                false,
//                                true,
//                                false,
//                                true,
//                                false),
//                            new Array(
//                                false,
//                                true,
//                                false,
//                                true,
//                                false),
//                            new Array(),
//                              offset
//                                                     );

// mainGrid = new rElemGrid(
//                             availableRelems,
//                            {w:screenWidth,h:screenHeight},
//                            {w:3,h:9},      
//                             100/84,
//                             screenWidth/screenHeight,
//                             new Array(
//                                 49/100,
//                                 2/100,
//                                 49/100),
//                             new Array(
//                                 16/84,
//                                 4/84,
//                                 13/84,
//                                 2.5/84,
//                                 13/84,
//                                 2.5/84,
//                                 13/84,
//                                 4/84,
//                                 16/84),
//                            new Array(
//                                false,
//                                true,
//                                false),
//                            new Array(
//                                false,
//                                true,
//                                false,
//                                true,
//                                false,
//                                true,
//                                false,
//                                true,
//                                false
//                                     ),
//                            new Array(),
//                              offset
//                                                     );

    var columnsList = [
        0.1,
        0.1,
        0.1,
        0.1,
        0.1,
        0.1,
        0.1,
        0.1,
        0.1,
        0.1];
    var rowsList = [
        0.1,
        0.1,
        0.1,
        0.1,
        0.1,
        0.1,
        0.1,
        0.1,
        0.1,
        0.1];
//     var columnsMasksList = new Array();
//     var rowsMasksList = new Array();
    var nColumns = 10;
    var nRows = 10;
//     for(var x = 0; x < nColumns; x++){
//         columnsMasksList.push(false);
//     }
//     for(var y = 0; y < nRows; y++){
//         rowsMasksList.push(false);
//     }



//  mainGrid.newRelem(relem.x,relem.y,relem.width,relem.height,relem.type,relem.z,(typeof(relem.displayMode)!='undefined'?relem.displayMode:'zIndex'),relem.data);
/*
mainGrid.newRelem(0,0,10,10,'ImageGallery','front','zIndex',{url:['http://kevin.henzer.ch/tmpImages/IMGP3773.JPG','http://kevin.henzer.ch/tmpImages/IMGP3774.JPG','http://kevin.henzer.ch/tmpImages/IMGP3776.JPG','http://kevin.henzer.ch/tmpImages/IMGP3777.JPG','http://kevin.henzer.ch/tmpImages/IMGP3778.JPG','http://kevin.henzer.ch/tmpImages/IMGP3779.JPG','http://kevin.henzer.ch/tmpImages/IMGP3780.JPG','http://kevin.henzer.ch/tmpImages/IMGP3781.JPG','http://kevin.henzer.ch/tmpImages/IMGP3782.JPG','http://kevin.henzer.ch/tmpImages/IMGP3784.JPG','http://kevin.henzer.ch/tmpImages/IMGP3785.JPG','http://kevin.henzer.ch/tmpImages/IMGP3786.JPG','http://kevin.henzer.ch/tmpImages/IMGP3787.JPG','http://kevin.henzer.ch/tmpImages/IMGP3788.JPG','http://kevin.henzer.ch/tmpImages/IMGP3789.JPG','http://kevin.henzer.ch/tmpImages/IMGP3790.JPG','http://kevin.henzer.ch/tmpImages/IMGP3791.JPG'],interval:1000,displayMode:'fit'});*/


/*
 * Starting client
 */
var serverConnection    = false;
var client              = new (require('websocket').client)();

/*
 * First get the IP address
 */
var os=require('os');
var ifaces=os.networkInterfaces();
var ip = "";
var lastActivity = null;
var newGrid      = false;

var pingIntervalSeconds = 20;
var timeoutSeconds = 60;

for (var dev in ifaces) 
{
    ifaces[dev].forEach(function (details){
        if (details.family=='IPv4')
        {
            ip = details.address;
        }
    });
}

/*
 * Now we can connect
 */
client.on('connectFailed', function(error) {
    serverConnection    = false;
});

client.on('connect', function(connection)
{
    console.log('[Client] Connected');
    serverConnection            = connection;
    
    connection.on('error', function(error)
    {
        console.log('[Client] error');
        serverConnection        = false;  
        console.log(error.msg);
        connection.close();
    });
    connection.on('close', function()
    {
        console.log('[Client] close');
        serverConnection        = false;        
    });
    connection.on('message', function(message)
    {
        console.log('[Client] Received message :'+message.utf8Data);
        
        var parsedMessage       = false;
        var slide               = false;
        
        lastActivity            = (new Date()).getTime();

        try
        {
            parsedMessage = JSON.parse(message.utf8Data);
        }
        catch(e)
        {
                console.error('[Client] Error parsing message '+message.utf8Data);
                return;
        }
        
        if(parsedMessage.type == 'slide' )
        {
            if(!mainGrid)
            {
                console.error('[Client] Received slide, but maingrid is not instanciated');
                return;
            }
            slide = parsedMessage.slide;
  
        
            /*
             * Sort by zIndex asc
             */   
            if(
                slide._id       == currentSlide._id &&
                slide.lastEdit  == currentSlide.lastEdit &&
                slide.xStart    == parsedMessage.xStart &&
                slide.yStart    == parsedMessage.yStart &&
                !newGrid)
            {
                console.error('[Client] same slide received twice, ignoring');
                newGrid = false;
                return;
            }
                
            currentSlide._id         = slide._id;
            currentSlide.lastEdit   = slide.lastEdit;
        
            slide.relems = slide.relems.sort(
                (function(a,b){
                    var az = parseInt(a.z);
                    var bz = parseInt(b.z);
                    return az < bz ? -1 : az > bz ? 1 : 0
                    
                })
            );
            
            slide.relems = slide.relems.filter(
                (function(v,i){
                    return !parseBool(v.locked);
                })
            );
        
            /*
             * If cleaning required
             */
//             if(parseBool(slide.clear))
//             {
//                 console.log("[renderer] clearRect");
//                 ctx.clearRect(0,0,screenWidth,screenHeight);
//             }
            
//                if(parseBool(relem.locked))
//                {
//                    initialLength--;
//                    console.log("[renderer] rElem "+relem.type+" locked");
//                }
            
            console.log("[renderer] Adding "+slide.relems.length+" relems to queue");
            
            // Count of pending relems, which will not vary unless some rElems are invalid
            var initialLength = slide.relems.length;

            slide.xStart = parsedMessage.xStart;
            slide.yStart = parsedMessage.yStart;

            
            for(var i in slide.relems)
            {
               var relem = slide.relems[i];
//                console.log("[renderer] Size: ["+relem.width+":"+relem.height+"]");
               

               
               if(!mainGrid.queueRelem(
                   parsedMessage.xStart,
                   parsedMessage.yStart,
                   relem.x,
                   relem.y,
                   relem.width,
                   relem.height,
                   relem.type,
                   relem.z,(typeof(relem.displayMode)!='undefined'?relem.displayMode:'zIndex'),
                   relem.data,
                   parsedMessage.dateStart,
                   function(){
                       // If last relem is loaded
                       if(mainGrid.nextSlideGlobalRelemList.length == initialLength)
                       {
                           console.log("[renderer] Next slide");
                           mainGrid.nextSlide(ctx,'smooth',true);
                       }
                       else
                           console.log("[renderer] Next slide not ready. "+mainGrid.nextSlideGlobalRelemList.length+" ready out of "+initialLength);
                   }
               ))
               {
                   initialLength--;
                   console.log("[renderer] Invalid rElem. Now waiting for "+initialLength+" rElems for this slide");
               }
            }
            if(mainGrid.nextSlideGlobalRelemList.length == initialLength)
            {
                           console.log("[renderer] Next slide");
                           mainGrid.nextSlide(ctx,'smooth',true);
            }
            
        }
        else if(parsedMessage.type == 'windowModel')
        {
            if(mainGrid)
            {
                mainGrid.clearAll();
                canvas.cleanUp();
                
                console.error('[Client] New grid requested');

                newGrid = true;
                
                delete(GLOBAL.mainGrid);
                
                global.gc();
            }
                console.log('[Client] Building grid');
//             console.error(availableTransitions);
            GLOBAL.mainGrid = new rElemGrid(
                                        availableRelems,
                                        availableTransitions,
                                       {w:screenWidth,h:screenHeight},
                                       {
                                           w:   parsedMessage.windowModel.cols.length,
                                           h:   parsedMessage.windowModel.rows.length
                                        },
                                       parsedMessage.windowModel.ratio,
                                       screenWidth/screenHeight,
                                       parsedMessage.windowModel.cols,
                                       parsedMessage.windowModel.rows,
                                       parsedMessage.windowModel.margin,
                                       offset
                                                                );

            mainGrid.computePositions();
            
            ctx.restore();
            /*
             * Clip to drawable area
             */
            ctx.beginPath();
            ctx.rect(mainGrid.wrapper.base.x,mainGrid.wrapper.base.y,mainGrid.wrapper.width,mainGrid.wrapper.height); 
            ctx.clip();
            ctx.save();
            
            console.log('[Client] Grid coordinates computed');
            
            return;
        }
        else if(parsedMessage.type == 'ping')
        {
            return;
//                 lastActivity = (new Date()).getTime();
        }
        else
        {
            console.error('[Client] unknown message type: type='+parsedMessage.type+' / message:'+message.utf8Data);
            return;
        }
    });
    /*
     * Sending our id
     */
    connection.send(JSON.stringify({type:'announce',ip:ip,windowId:windowId}),function(error){
        if(error)
        {
            console.log('[Client] send Id error');
            connection.close();
            serverConnection = false;
        }
    });
});


client.connect('ws://'+serverIp+':'+serverPort+'/', 'echo-protocol');

/*
 * Watchdog v 2.0 uses the current TCP connection
 */
var checkInterval = setInterval(function (){

    if (serverConnection){
        console.log("[Client.watchdog] ping");
        serverConnection.send(JSON.stringify({type:'ping',windowId:windowId,ip:ip}), function (){
        });
    }
    if ( lastActivity + timeoutSeconds * 1000 < (new Date()).getTime() ){
        console.log("Lost connection to server. Retrying...");
        serverConnection = false;
        client.connect('ws://'+serverIp+':'+serverPort+'/', 'echo-protocol');
    }
}, pingIntervalSeconds * 1000);


/*
 * Cleaning screen once
 */
ctx.globalAlpha = 1;
ctx.fillStyle   = "#000000";   
ctx.fillRect(0,0,screenWidth,screenHeight);
ctx.save();


var eu          = require('/home/pi/pmw/client/node/util');
var j           = 0;

eu.animate(function (time)
{
    if(exiting || !mainGrid)
        return;

//     ctx.globalAlpha = 1;
//     ctx.fillStyle   = "#000000";   
//     ctx.fillRect(0,0,screenWidth,screenHeight);

//     ctx.globalAlpha = 0.5;

    mainGrid.drawRelems(ctx);
});

function gracefulExit()
{
    exiting             = true;
/*    
    ctx.fillStyle       ="#000000";   
    ctx.fillRect(0,0,screenWidth,screenWidth);
        */
    if(serverConnection)
        serverConnection.close();
    
    if(mainGrid)
        mainGrid.clearAll();

    canvas.cleanUp();

    console.error('[Client] SIGINT or SIGTERM received. Closing...');
    
    global.gc();

    process.exit(0);
} 

process.stdin.on('data', function (text) {});
process.on('SIGINT',gracefulExit).on('SIGTERM', gracefulExit);

eu.handleTermination();
eu.waitForInput();
