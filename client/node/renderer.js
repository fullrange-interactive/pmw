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
var relemsPath          = '/home/pi/pmw/client/node//relems/';
var screenWidth         = 1366;
var screenHeight        = 768;

var sys                 = require('sys')
var exec                = require('child_process').exec;

var connectedScreenResolution   = new Array(1024,768);

var options             = require('/home/pi/config.json');

screenWidth             = options.connectedScreenResolution[0];
screenHeight            = options.connectedScreenResolution[1];
    
var windowId            = options.windowId;

    console.log("[Client] Screen dimensions: "+screenWidth+" x "+screenHeight);




//screenWidth                         = connectedScreenResolution[0];
//screenHeight                        = connectedScreenResolution[1];
//>>>>>>> d4ebe64dee0f4d538d856b05dcf056ebe72ee9e9

var exiting             = false;
    
var gridId              = 1;
console.log("[Client] gridId "+gridId);

var currentSlide        = {lastEdit:(new Date()),_id:0};
// var serverIp            = '54.194.96.174';
// var serverIp            = '193.134.218.110';
var serverIp            = 'jebediah.pimp-my-wall.ch';
var serverPort          = 8000;
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
        
        var parsedMessage = false;
        var slide = false;;
            lastActivity = (new Date()).getTime();

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
            }
            else if(parsedMessage.type == 'windowModel')
            {
                if(mainGrid != false)
                {
                    mainGrid.clearAll();
                    canvas.cleanUp();
                    
                    console.error('[Client] New grid requested');
                    newGrid = true;
                    
                    delete(GLOBAL.mainGrid);
                    
                    global.gc();
                }
                console.log("Ratio:"+(parsedMessage.windowModel.cols.reduce(function(a,b){return a + b;})/parsedMessage.windowModel.rows.reduce(function(a,b){return a + b;})));
                GLOBAL.mainGrid = new rElemGrid(
                                            availableRelems,
                                           {w:screenWidth,h:screenHeight},
                                           {w:nColumns,h:nRows},
                                           1.90217391304,
                                           screenWidth/screenHeight,
//                                             parsedMessage.windowModel.cols.reduce(function(a,b){return a + b;})/parsedMessage.windowModel.rows.reduce(function(a,b){return a + b;}),
                                            parsedMessage.windowModel.cols,
                                            parsedMessage.windowModel.rows,
//                                            new Array(),
                                             offset
                                                                    );
//     iavailableRelems,
//     iscreenSize,
//     isize,                     // size of the grid 
//     iratioGrid,                 // Grid global ratio
//     iratioScreen,               // Screen global ratio
//     icolumnRatioList,           // List of columns ratios
//     irowRatioList,              // List of rows ratio
//     icolumnMaskList,            // List of mask columns
//     irowMaskList,             // List of mask rows
//     icellMaskList,             // List of isolated mask cells
//     ioffset

                mainGrid.computePositions();
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
      
            
            /*
             * Sort by zIndex asc
             */
        
        
        if(slide._id == currentSlide._id && slide.lastEdit == currentSlide.lastEdit && !newGrid)
        {
            console.error('[Client] same slide received twice, ignoring');
            newGrid = false;
            return;
        }
        
//         console.log('[Client] id and lastEdit '+slide._id+' == '+currentSlide._id+' && '+slide.lastEdit+' == '+currentSlide.lastEdit);
        
        currentSlide._id         = slide._id;
        currentSlide.lastEdit   = slide.lastEdit;
        
        slide.relems = slide.relems.sort(
            (function(a,b){
                var az = parseInt(a.z);
                var bz = parseInt(b.z);
                return az < bz ? -1 : az > bz ? 1 : 0
                
            })
        );

        mainGrid.clearAll();
        
        /*
         * If cleaning required
         */
        if(parseBool(slide.clear))
        {
            console.log("[renderer] clearRect");
            ctx.clearRect(0,0,2000,2000)
        }

        
        for(var i in slide.relems)
        {
               var relem = slide.relems[i];
               //                baseX,  baseY,  sizeX,      sizeY,       className, zIndex, displayMode,data
               mainGrid.newRelem(relem.x,relem.y,relem.width,relem.height,relem.type,relem.z,(typeof(relem.displayMode)!='undefined'?relem.displayMode:'zIndex'),relem.data);
        }
    });
    /*
     * Sending our id
     */
    connection.send(JSON.stringify({type:'announce',ip:ip,windowId:gridId}),function(error){
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
    /*
    // Update IP address in case it changed
    for (var dev in ifaces) 
    {
        ifaces[dev].forEach(function (details){
            if (details.family=='IPv4')
            {
                ip = details.address;
            }
        });
    }
    */
    if ( serverConnection ){
        console.log("ping");
        serverConnection.send(JSON.stringify({type:'ping',windowId:gridId,ip:ip}), function (){
        });
    }
    if ( lastActivity + timeoutSeconds * 1000 < (new Date()).getTime() ){
        console.log("Lost connection to server. Retrying...");
        serverConnection = false;
        client.connect('ws://'+serverIp+':'+serverPort+'/', 'echo-protocol');
    }
}, pingIntervalSeconds * 1000);


/*
 * Starting UDP localping 
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

 


// var canvasFront      = new Canvas(100,100,1);
// var canvasFrontCtx   = canvasFront.getContext('2d');
// canvasFrontCtx.clearRect(0,0,100,100);

// 
// // Draw mask
ctx.globalAlpha = 1;
ctx.fillStyle   = "#000000";   
ctx.fillRect(0,0,screenWidth,screenHeight)

var eu          = require('/home/pi/pmw/client/node/util');
var j           = 0;

eu.animate(function (time)
{
    if(exiting || !mainGrid)
        return;
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
//    var redrawCoordinates 
   
   for(var i = mainGrid.globalRelemList.length;i>0;i--)
   {
       if(mainGrid.globalRelemList[i-1].needRedraw)
       {
//            console.log("[renderer]"+mainGrid.globalRelemList[i-1].type+" needs redraw");

           for(var j in mainGrid.globalRelemList[i-1].cellList)
           {
               for(var k in mainGrid.globalRelemList[i-1].cellList[j])
               {
                   var x=mainGrid.globalRelemList[i-1].cellList[j].x;
                   var y=mainGrid.globalRelemList[i-1].cellList[j].y;
//                       console.error("At "+x+":"+y+"=> "+mainGrid.relemGrid[x][y].relemList.length+" relem(s) need redraw");
                      
                  for(var l in  mainGrid.relemGrid[x][y].relemList)
                  {
                      if(mainGrid.globalRelemList[i-1].instanceName == mainGrid.relemGrid[x][y].relemList[l].instanceName                                       // If same relem
                          || (mainGrid.globalRelemList[i-1].opaque && mainGrid.globalRelemList[i-1].z > mainGrid.relemGrid[x][y].relemList[l].z )      // If current relem is opaque and in front of the current one
                          || !mainGrid.relemGrid[x][y].relemList[l].isReady // If relem is not ready yet
                      )
                          continue;
                      
                       mainGrid.relemGrid[x][y].relemList[l].addRedrawZone(x,y);
//                        mainGrid.relemGrid[x][y].relemList[l].needRedraw = true;
//                         console.log("[renderer] At "+x+":"+y+"==> "+mainGrid.relemGrid[x][y].relemList[l].type+" needs redraw, overlaping "+mainGrid.globalRelemList[i-1].type+" zIndexes: "+mainGrid.globalRelemList[i-1].z+","+mainGrid.relemGrid[x][y].relemList[l].z);

                  }
               }
           }
       }
   }
    
   for(var i in mainGrid.globalRelemList)
   {
       if ( allLoaded || mainGrid.toDeleteQueue.indexOf(mainGrid.globalRelemList[i]) != -1 )
           if(mainGrid.globalRelemList[i].needRedraw || mainGrid.globalRelemList[i].redrawZones.length > 0)
           {
//                   console.log("[Renderer] drawing "+mainGrid.globalRelemList[i].type);

               mainGrid.globalRelemList[i].smartDraw(ctx);
           }
         }
//          if(j==1)
//              console.log("[Renderer] drawed "+mainGrid.globalRelemList.length+" relems");
//           
//          j = (j+1)%20; 
//       
//       if(allLoaded && mainGrid.globalRelemList.length > 0)
//           process.exit(0);
      ctx.fillStyle="#000000";   
      mainGrid.draw(ctx);
    
});

function gracefulExit() {
    exiting             = true;
    
    ctx.fillStyle       ="#000000";   
    ctx.fillRect(0,0,screenWidth,screenWidth);
        
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


