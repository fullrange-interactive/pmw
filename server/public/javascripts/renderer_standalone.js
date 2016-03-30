
function getQueryParams(qs) {
    qs = qs.split("+").join(" ");
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }

    return params;
}

var $_GET = getQueryParams(document.location.search);

var mainGrid = null;
var serverIp = $_GET['serverIp'];
var serverPort = $_GET['serverPort'];
var windowId = $_GET['windowId'];

var screenWidth = $( "#editorWindow" ).width();
var screenHeight = $( "#editorWindow" ).height();

$(document).ready(function(){
    screenWidth = $( "#editorWindow" ).width();
    screenHeight = $( "#editorWindow" ).height();
});
var currentSlide = '';

// /*
// * Starting client
// */
// var serverConnection    = false;

// var lastActivity = null;
// var newGrid      = false;

// var pingIntervalSeconds = 9;
// var timeoutSeconds      = 30;
// var ip                  = "";

// var columnsMasksList = new Array();
// var rowsMasksList = new Array();

// for(var x = 0; x < columnsList.length; x++){
//     columnsMasksList.push(false);
// }
// for(var y = 0; y < rowsList.length; y++){
//     rowsMasksList.push(false);
// }
// if ( !$("#editorWrapper").hasClass("fullScreen") ){
//     width = $("#editorWindow").width();
//     height = width / ratio;
//     $("#editorWindow").height(height);
// }else{
//     width = $("#editorWrapper").width();
//     height = width / ratio;
//     //$("#editorWindow").width(width);
//     $("#editorWindow").height(height);
//     console.log((($("#editorWrapper").height()-height)/2)+'px');
//     $("#editorWindow").css("top",(($("#editorWrapper").height()-height)/2)+'px');
// }
// mainGrid = new rElemGrid(
//                         columnsList.length,
//                         rowsList.length,           
//                         ratio,
//                         width/height,
//                         columnsList,
//                         rowsList,rElemGrid
//                         columnsMasksList,
//                         rowsMasksList,
//                         new Array()
// );
// $("#editorWindow").empty();
// $('#editorWindow').append(mainGrid.getDOM($('#editorWindow').width(),$('#editorWindow').height()));
// mainGrid.dom = $("#editorWindow").get();


var client = new WebSocket('ws://'+serverIp+':'+serverPort+'/', 'echo-protocol');

client.onerror = function(error)
{
  console.log('[Client] Cannot connect');
  serverConnection    = false;
};

client.onclose = function()
{
    console.log('[Client] close');
    serverConnection        = false;        
};

client.onmessage =  function(message)
{        
    // message = message.data;

    message.utf8Data = message.data;

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
            console.log('[Client][Error] Received slide, but maingrid is not instanciated');
            return;
        }

        slide               = parsedMessage.slide;

        // Slide position in window group

        slide.xStart        = parsedMessage.xStart;
        slide.yStart        = parsedMessage.yStart;
        slide.dateStart     = new Date(parsedMessage.dateStart);

        if(
            slide._id       == currentSlide._id &&
            slide.lastEdit  == currentSlide.lastEdit &&
            slide.xStart    == currentSlide.xStart &&
            slide.yStart    == currentSlide.yStart &&
            slide.dateStart == currentSlide.dateStart &&
            !newGrid)
        {
            console.error('[Client] same slide received twice, ignoring');
            newGrid = false;
            return;
        }

        // console.error('[Client] Queuing slide');

        mainGrid.removeAll();        

        for(var i in slide.relems)
        {          
            var relem = slide.relems[i];

            console.log('[Client] Creating relem of type '+relem.type);     
            console.log(relem);       

            mainGrid.newRelem(
                relem.x,
                relem.y,
                relem.width,
                relem.height,
                relem.type,
                (typeof(relem.displayMode) != 'undefined' ? relem.displayMode : relem.z),
                relem.data
            );
        }

        currentSlide = slide;
    }
    else if(parsedMessage.type == 'sequence')
    {
        console.log('[Client][Error] Received sequence, but not yet implemented');

        return;

        // if(!mainGrid)
        // {
        //     console.log('[Client][Error] Received sequence, but maingrid is not instanciated');
        //     return;
        // }

        // var sequence        = parsedMessage.sequence;
        // var loop            = parsedMessage.loop;

        // for(var i in sequence)
        // {
        //     var slide = sequence[i];

        //     // xStart:      sequence in windowgroup
        //     // winx:        screen in sequence

        //     slide.xStart = parsedMessage.xStart-slide.winX;
        //     slide.yStart = parsedMessage.yStart-slide.winY;

        //     console.error('[Client] Sequence: queuing slide. Scedulded in '+((new Date(parsedMessage.dateStart).getTime()+slide.timeAt*1000)-(new Date()).getTime())+' ms');

        //     mainGrid.queueSlide(
        //         slide,
        //         new Date(new Date(parsedMessage.dateStart).getTime() +slide.timeAt*1000),
        //         slide.transition,
        //         function()
        //         {
        //             currentSlide._id        = slide._id;
        //             currentSlide.lastEdit   = slide.lastEdit;
        //             currentSlide.xStart     = slide.xStart;
        //             currentSlide.yStart     = slide.yStart;
        //             currentSlide.dateStart  = slide.dateStart;
        //         }
        //     );
        // }   
    }
    else if(parsedMessage.type == 'windowModel')
    {
        if(mainGrid)
        {
            mainGrid.clearAll();

            console.error('[Client] New grid requested. Window is at '+parsedMessage.x+':'+parsedMessage.y);

            newGrid = true;

            delete(mainGrid);

            // global.gc();
        }

        console.log('[Client] Building grid '+parsedMessage.windowModel.cols.length+" x "+parsedMessage.windowModel.rows.length);
        console.log('[Client] Ratios '+parsedMessage.windowModel.ratio+" vs "+screenWidth+"/"+screenHeight);

        // console.error(availableTransitions);


        var columnsMasksList = new Array();
        var rowsMasksList = new Array();
        for(var x = 0; x < parsedMessage.windowModel.cols.length; x++){
            columnsMasksList.push(false);
        }
        for(var y = 0; y < parsedMessage.windowModel.rows.length; y++){
            rowsMasksList.push(false);
        }                          

        var screenHeight = $(window).height();
        var screenWidth = $(window).width();

        console.log("Screen: "+screenWidth+" x "+screenHeight);

        if(screenWidth/screenHeight > parsedMessage.windowModel.ratio)
        {
            console.log(screenWidth/parsedMessage.windowModel.ratio+" x "+screenHeight);

            $("#editorWindow").width(screenHeight*parsedMessage.windowModel.ratio);                        
            $("#editorWindow").height(screenHeight);
        }
        else
        {
            console.log(screenWidth+" x "+screenWidth/parsedMessage.windowModel.ratio);

            $("#editorWindow").width(screenWidth);
            $("#editorWindow").height(screenWidth/parsedMessage.windowModel.ratio);            
        }

        // console.log(parsedMessage.windowModel); 

        mainGrid = new rElemGrid(
            parsedMessage.windowModel.cols.length,
            parsedMessage.windowModel.rows.length,           
            parsedMessage.windowModel.ratio,
            parsedMessage.windowModel.ratio,
            parsedMessage.windowModel.cols,
            parsedMessage.windowModel.rows,
            columnsMasksList,
            rowsMasksList,
            new Array());

        mainGrid.dom = $("#editorWindow").get();


        // mainGrid.computePositions();

        $('#editorWindow').append(mainGrid.getDOM($("#editorWindow").width(),$("#editorWindow").height()));

        // console.log(dom);


        // ctx.restore();
        // /*
        // * Clip to drawable area
        // */
        // ctx.beginPath();
        // ctx.rect(mainGrid.wrapper.base.x,mainGrid.wrapper.base.y,mainGrid.wrapper.width,mainGrid.wrapper.height); 
        // ctx.clip();
        // ctx.save();

        console.log('[Client] Grid coordinates computed');

        return;
    }
    else if(parsedMessage.type == 'ping')
    {
        return;
        //                 lastActivity = (new Date()).getTime();
    }
    else if(parsedMessage.type == 'neighbors')
    {
        console.log('[Client][Error] Received neighbors, but not yet implemented');
        return;

        // ipcServer.updateNeighbors(parsedMessage.neighbors);
    }
    else if(parsedMessage.type == 'dataStream')
    {
        console.log('[Client][Error] Received dataStream, but not yet implemented');
        return;

        serverStreamer.onReceive(parsedMessage.data);
    }
    else
    {
        console.error('[Client] unknown message type: "'+parsedMessage.type+'" Complete message:'+message.utf8Data);
        return;
    }
};

client.onopen = function(connection)
{
    console.log('[Client] Connected');
    serverConnection = connection;

    /*
    * First get the IP address (no way on browser)
    */
    
    ip = '10.0.0.254';

    // var os      = require('os');
    // var ifaces  = os.networkInterfaces();

    // for (var dev in ifaces) 
    // {
    //     if(dev == 'eth0')
    //     {
    //         ifaces[dev].forEach(function (details){
    //             if (details.family=='IPv4')
    //             {
    //                 ip = details.address;
    //             }
    //         });
    //     }
    // }

    /*
    * Sending our id
    */
    client.send(JSON.stringify({type:'announce',ip:ip,windowId:windowId}),function(error){
        if(error)
        {
            console.log('[Client] send Id error');
            client.close();
            serverConnection = false;
        }
    });
};



