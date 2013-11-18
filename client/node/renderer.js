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
GLOBAL.mainGrid         = {};

var modulesPath         = './node_modules/';
var openvgCanvasPath    = modulesPath+'openvg-canvas/';
var relemsPath          = './relems/';
var screenWidth         = 1280;
var screenHeight        = 1024;
var gridId              = 1;
var serverIp            = '192.168.3.4';

var availableRelems     = {};

var Class               = require('./class.js').Class;
var base_rElem          = Class.extend(require('./relem.js').rElem);

var fs                  = require('fs');
var path                = require('path');

var files               = fs.readdirSync(relemsPath);

for(var i in files)
  /*
   * Include all js files from the rElems dir
   */
  if(path.extname(files[i]) == '.js')
  {
     var new_rElem      = require(relemsPath+files[i]).class;
     
     availableRelems[new_rElem.type] = base_rElem.extend(new_rElem);
     
     console.log('[Startup] rElem ['+new_rElem.type+'] available ');
  }

var rElemGrid   = require('./rElemGrid.js').rElemGrid;

GLOBAL.Canvas      = require(openvgCanvasPath+'lib/canvas');
var canvas      = new Canvas(screenWidth,screenHeight,0);
var ctx         = canvas.getContext('2d');
// ctx.setGlobalAlpha(0);


/*
 * Window physical propreties
 */
var gridWidth               = 9;
var gridHeight              = 5;

var windowGlobalWidth       = 175;
var windowGlobalHeight      = 92;

var topBottomSeparator      = 16;

var rowSeparator            = 3.8;
var columnSeparator         = 3.8;

var subTopWindowHeight      = 15;
var subWindowHeight         = 29;
var subWindowWidth          = 31.6;

// var offset               = {left:54,top:205,right:46,bottom:0};

var offset               = {left:0,top:0,right:0,bottom:0};

/***---------------------------***/

var subWindowWidthRatio     = subWindowWidth                /windowGlobalWidth;
var columnSeparatorRatio    = columnSeparator               /windowGlobalWidth;

var topRowHeightRatio       = subTopWindowHeight            /windowGlobalHeight;
var rowSeparatorRatio       = rowSeparator                  /windowGlobalHeight;
var subWindowHeightRatio    = subWindowHeight               /windowGlobalHeight;
var topBottomSeparatorRatio = topBottomSeparator           /windowGlobalHeight;

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

mainGrid = new rElemGrid(
                            availableRelems,
                           {w:screenWidth,h:screenHeight},
                           {w:3,h:9},      
                            100/84,
                            screenWidth/screenHeight,
                            new Array(
                                49/100,
                                2/100,
                                49/100),
                            new Array(
                                16/84,
                                4/84,
                                13/84,
                                2.5/84,
                                13/84,
                                2.5/84,
                                13/84,
                                4/84,
                                16/84),
                           new Array(
                               false,
                               true,
                               false),
                           new Array(
                               false,
                               true,
                               false,
                               true,
                               false,
                               true,
                               false,
                               true,
                               false
                                    ),
                           new Array(),
                             offset
                                                    );



mainGrid.computePositions();
// mainGrid.newRelem(0,0,2,5,'Marquee','front',{text:'Happy Hour dans:',color:'FF0000',speed:2,invert:false});


/*
 * Starting client
 */
var serverConnection    = false;
var client              = new (require('websocket').client)();
    
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
        
        var slide = JSON.parse(message.utf8Data);
        
        /*
         * Sort by zIndex asc
         */
        
        if(!slide)
            return;
        
        slide.relems = slide.relems.sort(
            (function(a,b){
                var az = parseInt(a.z);
                var bz = parseInt(b.z);
                return az < bz ? -1 : az > bz ? 1 : 0
                
            })
        );
        
        /*
         * If cleaning required
         */
        if(parseBool(slide.clear))
        {
            mainGrid.clearAll();
            ctx.clearRect(0,0,screenWidth,screenHeight)
        }
        
        for(var i in slide.relems)
        {
               var relem = slide.relems[i];
               mainGrid.newRelem(relem.x,relem.y,relem.width,relem.height,relem.type,relem.z,relem.data);
        }
    });
    /*
     * Sending our id
     */
    connection.send(gridId,function(error){
        if(error)
        {
            console.log('[Client] send Id error');
            connection.close();
            serverConnection = false;
        }
    });
});

/*
 * Starting watchdog
 */



var watchdog = require('./watchdog.js').watchdog.initialize(
    gridId,
    serverIp,
    function(){ // Alive callback
        return !(serverConnection == false);
    },
    function(){ // Reconnect callback
                // Called once on creation
        client.connect('ws://'+serverIp+':8080/', 'echo-protocol');
    },
    function(){ // Timeout callback
        client.close();
    }
);

 
process.stdin.on('data', function (text) {
});

// var canvasFront      = new Canvas(100,100,1);
// var canvasFrontCtx   = canvasFront.getContext('2d');
// canvasFrontCtx.clearRect(0,0,100,100);

// 
// // Draw mask
ctx.globalAlpha = 1;
ctx.clearRect(0,0,screenWidth,screenHeight)

var eu          = require('./util');

eu.animate(function (time)
{
    // Clean screen
       //ctx.clearRect(0,0,screenWidth,screenWidth)

    // Draw relems
       for(var i in mainGrid.globalRelemList)
          mainGrid.globalRelemList[i].draw(ctx);
//       
      ctx.fillStyle="#000000";   
      mainGrid.draw(ctx);
    
});



eu.handleTermination();
eu.waitForInput();
