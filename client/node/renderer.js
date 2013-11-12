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
var screenHeight        = 720;
var gridId              = 1;
var serverIp            = '192.168.3.1';

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
     
     console.log('[Startup] rElem ['+new_rElem.type+'] available '+availableRelems[new_rElem.type]);
  }

var rElemGrid   = require('./rElemGrid.js').rElemGrid;

var Canvas      = require(openvgCanvasPath+'lib/canvas');
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

var offset               = {left:54,top:205,right:46,bottom:0};

/***---------------------------***/

var subWindowWidthRatio     = subWindowWidth                /windowGlobalWidth;
var columnSeparatorRatio    = columnSeparator               /windowGlobalWidth;

var topRowHeightRatio       = subTopWindowHeight            /windowGlobalHeight;
var rowSeparatorRatio       = rowSeparator                  /windowGlobalHeight;
var subWindowHeightRatio    = subWindowHeight               /windowGlobalHeight;
var topBottomSeparatorRatio = topBottomSeparator           /windowGlobalHeight;


                    
mainGrid = new rElemGrid(
                            availableRelems,
                           {w:screenWidth,h:screenHeight},
                           {w:gridWidth,h:gridHeight},      
                            windowGlobalWidth/windowGlobalHeight,
                            screenWidth/screenHeight,
                            new Array(
                                subWindowWidthRatio,
                                columnSeparatorRatio,
                                subWindowWidthRatio,
                                columnSeparatorRatio,
                                subWindowWidthRatio,
                                columnSeparatorRatio,
                                subWindowWidthRatio,
                                columnSeparatorRatio,
                                subWindowWidthRatio),
                            new Array(
                                topRowHeightRatio,
                                rowSeparatorRatio,
                                subWindowHeightRatio,
                                topBottomSeparatorRatio,
                                subWindowHeightRatio),
                           new Array(
                               false,
                               true,
                               false,
                               true,
                               false,
                               true,
                               false,
                               true,
                               false),
                           new Array(
                               false,
                               true,
                               false,
                               true,
                               false),
                           new Array(),
                             offset
                                                    );





mainGrid.computePositions();
mainGrid.newRelem(0,1,5,1,'Marquee','front',{text:'Happy Hour dans:',color:'FF0000',speed:2,invert:false});


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
    serverConnection            = connection;
    connection.on('error', function(error) {
        serverConnection        = false;        
        connection.close();
    });
    connection.on('close', function() {
        serverConnection        = false;        
    });
    connection.on('message', function(message)
    {
        var slide = JSON.parse(message.utf8Data);
        
        /*
         * Sort by zIndex asc
         */
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
            mainGrid.clearAll();
        
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
        return serverConnection;
    },
    function(){ // Reconnect callback
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


var eu          = require('./util');

eu.animate(function (time)
{
    // Clean screen
    ctx.clearRect(0,0,screenWidth,screenWidth)

    // Draw relems
      for(var i in mainGrid.globalRelemList)
         mainGrid.globalRelemList[i].draw(ctx);
      
      ctx.fillStyle="#000000";   
      mainGrid.draw(ctx);
    
});



eu.handleTermination();
eu.waitForInput();
