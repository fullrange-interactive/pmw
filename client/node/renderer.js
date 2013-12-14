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

var modulesPath         = '/home/pi/pmw/client/node/node_modules/';
var openvgCanvasPath    = modulesPath+'openvg-canvas/';
var relemsPath          = '/home/pi/pmw/client/node//relems/';
var screenWidth         = 1366;
var screenHeight        = 768;
var gridId              = 1;
var serverIp            = '54.194.96.174';

var availableRelems     = {};

var Class               = require('/home/pi/pmw/client/node/class.js').Class;
var base_rElem          = Class.extend(require('/home/pi/pmw/client/node/relem.js').rElem);

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

GLOBAL.MediaServer = new (require('/home/pi/pmw/client/node/mediaServer.js').mediaServer)();
  
var rElemGrid   = require('/home/pi/pmw/client/node/rElemGrid.js').rElemGrid;

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
        0.01579,
        0.520445,
        0.017277,
        0.01009078,
        0.034937,
        0.0964695,
        0.20937189,
        0.0800841,
        0.016445];
    var rowsList = [
        0.088958,
        0.086350,
        0.065859,
        0.234375,
        0.018971,
        0.042318,
        0.327875,
        0.149579];
    var columnsMasksList = new Array();
    var rowsMasksList = new Array();
    var nColumns = 9;
    var nRows = 8;
    for(var x = 0; x < nColumns; x++){
        columnsMasksList.push(false);
    }
    for(var y = 0; y < nRows; y++){
        rowsMasksList.push(false);
    }

mainGrid = new rElemGrid(
                            availableRelems,
                           {w:screenWidth,h:screenHeight},
                           {w:nColumns,h:nRows},      
                            1366/768,                           // Grid ratio
                            screenWidth/screenHeight,           // Screen ratio
                            columnsList,
                            rowsList,
                            columnsMasksList,
                            rowsMasksList,
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
            ctx.clearRect(0,0,2000,2000)
        }

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
            console.log('[Client] send Id error');
            connection.close();
            serverConnection = false;
        }
    });
});


client.connect('ws://'+serverIp+':8080/', 'echo-protocol');


/*
 * Starting watchdog
 */



// var watchdog = require('/home/pi/pmw/client/node/watchdog.js').watchdog.initialize(
//     gridId,
//     serverIp,
//     function(){ // Alive callback
//         return !(serverConnection == false);
//     },
//     function(){ // Reconnect callback
//                 // Called once on creation
//         client.connect('ws://'+serverIp+':8080/', 'echo-protocol');
//     },
//     function(){ // Timeout callback
//         client.close();
//     }
// );

 
process.stdin.on('data', function (text) {
});

// var canvasFront      = new Canvas(100,100,1);
// var canvasFrontCtx   = canvasFront.getContext('2d');
// canvasFrontCtx.clearRect(0,0,100,100);

// 
// // Draw mask
ctx.globalAlpha = 1;
ctx.clearRect(0,0,screenWidth,screenHeight)

var eu          = require('/home/pi/pmw/client/node/util');
var j           = 0;

eu.animate(function (time)
{
    // Clean screen
//        ctx.fillRect(0,0,screenWidth,screenWidth)

    // Draw relems
    var allLoaded = true;
    for(var i in mainGrid.globalRelemList){
        if(mainGrid.globalRelemList[i].isReady === false){
            allLoaded = false;
            break;
        }
    }
    
    if( allLoaded == true && mainGrid.toDeleteQueue.length > 0 ){
        mainGrid.deleteQueue();
    }
  
    var allLoaded = true;
    for(var i in mainGrid.globalRelemList){
        if(mainGrid.globalRelemList[i].isReady === false){
            allLoaded = false;
            break;
        }
    } 
    
   
   /*
    * Resolving redraw dependencies 
    */
   var redrawCoordinates 
   
   for(var i = mainGrid.globalRelemList.length;i>0;i--)
   {
       if(mainGrid.globalRelemList[i-1].needRedraw)
       {
//            console.error(mainGrid.globalRelemList[i-1].type+" needs redraw");

           for(var j in mainGrid.globalRelemList[i-1].cellList)
           {
               for(var k in mainGrid.globalRelemList[i-1].cellList[j])
               {
                   var x=mainGrid.globalRelemList[i-1].cellList[j].x;
                   var y=mainGrid.globalRelemList[i-1].cellList[j].y;
//                       console.error("At "+x+":"+y+"=> "+mainGrid.relemGrid[x][y].relemList.length+" relem(s) need redraw");
                      
                  for(var l in  mainGrid.relemGrid[x][y].relemList)
                  {
                      if(mainGrid.globalRelemList[i-1].instanceName == mainGrid.relemGrid[x][y].relemList[l].instanceName
                          || mainGrid.globalRelemList[i-1].opaque
                          || !mainGrid.relemGrid[x][y].relemList[l].isReady
                      )
                          continue;
                      
                       mainGrid.relemGrid[x][y].relemList[l].addRedrawZone(x,y);
                       mainGrid.relemGrid[x][y].relemList[l].needRedraw = true;
//                         console.log("[renderer] At "+x+":"+y+"==> "+mainGrid.relemGrid[x][y].relemList[l].type+" needs redraw, covered by "+mainGrid.globalRelemList[i-1].type);

                  }
               }
           }
       }
   }
    
   for(var i in mainGrid.globalRelemList)
   {
       if ( allLoaded || mainGrid.toDeleteQueue.indexOf(mainGrid.globalRelemList[i]) != -1 )
           if(mainGrid.globalRelemList[i].needRedraw)
           {
//                  console.log("[Renderer] drawing "+mainGrid.globalRelemList[i].type);

               mainGrid.globalRelemList[i].smartDraw(ctx);
           }
         }
//          if(j==1)
//              console.log("[Renderer] drawed "+mainGrid.globalRelemList.length+" relems");
//           
//          j = (j+1)%20; 
//       
      ctx.fillStyle="#000000";   
      mainGrid.draw(ctx);
    
});



eu.handleTermination();
eu.waitForInput();
