/*
 * Window physical propreties
 */
var gridWidth               = 9;
var gridHeight              = 6;

var windowGlobalWidth       = 175;
var windowGlobalHeight      = 92;

var topBottomSeparator      = 16;

var rowSeparator            = 3.8;
var columnSeparator         = 3.8;

var subTopWindowHeight      = 16.1;
var subWindowHeight         = 28;
var subWindowWidth          = 31.6;

/***---------------------------***/

var subWindowWidthRatio     = subWindowWidth                /windowGlobalWidth;
var columnSeparatorRatio    = columnSeparator               /windowGlobalWidth;

var topRowHeightRatio       = subTopWindowHeight            /windowGlobalHeight;
var rowSeparatorRatio       = rowSeparator                  /windowGlobalHeight;
var subWindowHeightRatio    = subWindowHeight               /windowGlobalHeight;
var topBottomSeparatorRatio = topBottomSeparator           /windowGlobalHeight;


$(document).ready(function(){
    var grids = new Object();
    $(".renderer_canvas").each(function(){
        var grid = new rElemGrid(
            9,
            5,           
            windowGlobalWidth/windowGlobalHeight,
            $(this).width()/$(this).height(),
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
           new Array()
        );
        $(this).append(grid.getDOM());
        grid.dom = this;
        var mask = $('<div class="mask-image">');
        $(this).append(mask);
        var that = this;
        //grids[$(this).attr('id')].newRelem(0,0,1,1,'Color','front',{color:"FF0000"})
        $.getJSON("/slide",{id:$(this).attr('id')},function(data){
          if ( data )
            for(var i in data.relems){
                if ( $(that).hasClass("simulation") )
                    data.relems[i].data.noscroll = true;
                grid.newRelem(data.relems[i].x,data.relems[i].y,data.relems[i].width,data.relems[i].height,data.relems[i].type,data.relems[i].z,data.relems[i].data);
            }
        });
    });
});