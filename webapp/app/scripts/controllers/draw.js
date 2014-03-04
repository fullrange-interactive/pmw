/*global pmw, $*/

pmw.Controllers = pmw.Controllers || {};

(function () {
    'use strict';

    var ctx, x, y, e = null;

    var oldX, oldY = 0;
    var strokes;

    var foregroundColor = '#000000';

    var lineWidth = 5;

    var canvas;

    pmw.Controllers.DrawController = pmw.Controllers.AbstractController.extend({

        pageHeadline: M.I18N.get('draw.title'),

        selectionSize: M.Model.create({size: 5}),

        backgroundColor: '#ffffff',

        _initViews: function() {

            // Create the ContentView with the controller (this) as scope
            if( !this.contentView ) {
                this.contentView = pmw.Views.DrawView.create(this, null, true);
            }

            // Create the HeaderView with the controller (this) as scope
            if( !this.headerView ) {
                this.headerView = pmw.Views.BackheaderView.create(this, null, true);
            }

            this._applyViews();

            var current = this;

            $('.colorpicker.background input').spectrum({
                showPaletteOnly: true,
                showPalette:true,
                color: current.backgroundColor,
                palette: [
                            ["FFFFFF","FF0000","94c13c","0000FF"],
                            ["000000","964B00","07ace2","F57900"],
                            ["e5287b","75507B","FCE94F","888888"],
                            ["008800"]
                ],
                change: function( color ) {
                    current.setBackgroundColor(color.toHexString());
                }
            });

            $('.colorpicker.foreground input').spectrum({
                showPaletteOnly: true,
                showPalette:true,
                color: foregroundColor,
                palette: [
                            ["FFFFFF","FF0000","94c13c","0000FF"],
                            ["000000","964B00","07ace2","F57900"],
                            ["e5287b","75507B","FCE94F","888888"],
                            ["008800"]
                ],
                change: function( color ) {
                    foregroundColor = color.toHexString();
                    ctx.strokeStyle = foregroundColor;
                }
            });

            // setup a new canvas for drawing wait for device init
            setTimeout(function(){
               current.newCanvas();
            }, 1000);
        },

        // Register menu item for this view
        registerToMenu: function( menuController ){
            menuController.registerMenuItem({
                value:'draw',
                goto:'draw'
            });
        },

        setBackgroundColor: function( color ){
            this.backgroundColor = color;
            $("#contentCanvas canvas").css("background-color", this.backgroundColor);
        },

        newCanvas: function(){
            //define and resize canvas
            $("#contentCanvas").height($(window).height()-100);
            canvas = '<canvas id="canvas" width="'+$(window).width()+'" height="'+($(window).height()-100)+'"></canvas>';
            $("#contentCanvas").html(canvas);
 
            // setup canvas
            ctx=$("#contentCanvas canvas")[0].getContext("2d");
            ctx.strokeStyle = foregroundColor;
            ctx.lineWidth = lineWidth;  
            this.setBackgroundColor(this.backgroundColor);
            
            // setup to trigger drawing on mouse or touch
            $("#contentCanvas canvas").drawTouch();
            $("#contentCanvas canvas").drawPointer();
            $("#contentCanvas canvas").drawMouse();

            strokes = new Array();
        },

        clearDraw: function(){
            this.newCanvas();
        },

        changeSize: function(){
            lineWidth = $('.selectionSize select').val();
            ctx.lineWidth = lineWidth;
        },

        undo: function(){
            strokes.pop();
            this.repaint();
        },

        saveDraw: function(){
            console.log(strokes);
        },

        drawLine: function(color, width, x1, y1, x2, y2){
            if (x1 !== UNDEFINED && y1 !== UNDEFINED) {
                ctx.moveTo(x1 + params.x, y1 + params.y);
            }
            ctx.lineWidth = width;
            ctx.color = color;
            while (TRUE) {
                if (x2 !== null && y2 !== null) {
                    // Draw next line
                    ctx.lineTo(x2 + x1, y2 + y1);
                } else {
                    // Otherwise, stop drawing
                    break;
                }
            }                                           
        },

        repaint: function(){
            ctx.clearRect(0, 0, $("#contentCanvas canvas").width(), $("#contentCanvas canvas").height());
            for(var i = 0; i < strokes.length; i++ ){
                for(var j = 0; j < strokes[i].points.length-1; j++ ){
                   
                    this.drawLine(  strokes[i].color,
                                    strokes[i].lineWidth,
                                    strokes[i].points[j].x, 
                                    strokes[i].points[j].y,
                                    strokes[i].points[j+1].x,
                                    strokes[i].points[j+1].y
                                );
                   /* $('canvas').drawLine({
                        strokeStyle:strokes[i].color,
                        strokeWidth:strokes[i].lineWidth,
                        x1: strokes[i].points[j].x, 
                        y1: strokes[i].points[j].y,
                        x2: strokes[i].points[j+1].x,
                        y2: strokes[i].points[j+1].y,
                    });*/
                }
            }
            M.Logger.log('repaint', 'END');
        }
    });

    function saveStrokes( x, y ) {
        strokes.push({points:[{x:x,y:y},{x:x+1,y:y+1}],color:foregroundColor,lineWidth:lineWidth});
    }

    // prototype to start drawing on touch using canvas moveTo and lineTo
    $.fn.drawTouch = function() {
        var start = function(e) {
            e = e.originalEvent;
            ctx.beginPath();
            x = e.changedTouches[0].pageX;
            y = e.changedTouches[0].pageY-44;
            ctx.moveTo(x,y);
        };
        var move = function(e) {
            e.preventDefault();
            e = e.originalEvent;
            x = e.changedTouches[0].pageX;
            y = e.changedTouches[0].pageY-44;
            ctx.lineTo(x,y);
            ctx.stroke();

            saveStrokes(x, y);
        };
        $(this).on("touchstart", start);
        $(this).on("touchmove", move);  
    }; 
        
    // prototype to start drawing on pointer(microsoft ie) using canvas moveTo and lineTo
    $.fn.drawPointer = function() {
        var start = function(e) {
            e = e.originalEvent;
            ctx.beginPath();
            x = e.pageX;
            y = e.pageY-44;
            ctx.moveTo(x,y);
        };
        var move = function(e) {
            e.preventDefault();
            e = e.originalEvent;
            x = e.pageX;
            y = e.pageY-44;
            ctx.lineTo(x,y);
            ctx.stroke();
           
            saveStrokes(x, y);
        };
        $(this).on("MSPointerDown", start);
        $(this).on("MSPointerMove", move);
    };        

    // prototype to start drawing on mouse using canvas moveTo and lineTo
    $.fn.drawMouse = function() {
        var clicked = 0;
        var start = function(e) {
            clicked = 1;
            ctx.beginPath();
            x = e.pageX;
            y = e.pageY-44;
            ctx.moveTo(x,y);
        };
        var move = function(e) {
            if(clicked){
                x = e.pageX;
                y = e.pageY-44;
                ctx.lineTo(x,y);
                ctx.stroke();

                saveStrokes(x, y);
            }
        };
        var stop = function(e) {
            clicked = 0;
        };
        $(this).on("mousedown", start);
        $(this).on("mousemove", move);
        $(window).on("mouseup", stop);
    };

})();
