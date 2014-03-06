/*global pmw, $*/

pmw.Controllers = pmw.Controllers || {};

(function () {
    'use strict';

    var ctx, x, y = null;

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
                palette:
                [
                    ['FFFFFF','FF0000','94c13c','0000FF'],
                    ['000000','964B00','07ace2','F57900'],
                    ['e5287b','75507B','FCE94F','888888'],
                    ['008800']
                ],
                change: function( color ) {
                    current.setBackgroundColor(color.toHexString());
                }
            });

            $('.colorpicker.foreground input').spectrum({
                showPaletteOnly: true,
                showPalette:true,
                color: foregroundColor,
                palette:
                [
                    ['FFFFFF','FF0000','94c13c','0000FF'],
                    ['000000','964B00','07ace2','F57900'],
                    ['e5287b','75507B','FCE94F','888888'],
                    ['008800']
                ],
                change: function( color ) {
                    foregroundColor = color.toHexString();
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
            $('#contentCanvas canvas').css('background-color', this.backgroundColor);
        },

        newCanvas: function(){
            //define and resize canvas
            $('#contentCanvas').height($(window).height()-100);
            canvas = '<canvas id="canvas" width="'+$(window).width()+'" height="'+($(window).height()-100)+'"></canvas>';
            $('#contentCanvas').html(canvas);
 
            // setup canvas
            ctx=$('#contentCanvas canvas')[0].getContext('2d');
            ctx.strokeStyle = foregroundColor;
            ctx.lineWidth = lineWidth;
            this.setBackgroundColor(this.backgroundColor);
            
            // setup to trigger drawing on mouse or touch
            $('#contentCanvas canvas').drawTouch();
            $('#contentCanvas canvas').drawPointer();
            $('#contentCanvas canvas').drawMouse();

            strokes = [];
        },

        clearDraw: function(){
            this.newCanvas();
        },

        changeSize: function(){
            lineWidth = $('.selectionSize select').val();
            ctx.lineWidth = lineWidth;
        },

        undo: function(){
            //console.log(strokes);
            strokes.pop();
            //console.log(strokes);
            this.repaint();
        },

        saveDraw: function(){
            console.log(strokes);
            M.Toast.show("Your drawing was sent :)");
        },

        drawLine: function(color, width, x1, y1, x2, y2){
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            ctx.moveTo(x1,y1);
            ctx.lineTo(x2,y2);
            ctx.stroke();
            ctx.closePath();
        },

        repaint: function(){
            M.Logger.log('repaint', 'START');
            console.log(strokes);
            ctx.clearRect(0, 0, $('#contentCanvas canvas').width(), $('#contentCanvas canvas').height());
            for(var i = 0; i < strokes.length; i++ ){
                for(var j = 0; j < strokes[i].points.length-1; j++ ){
                   
                    this.drawLine(  strokes[i].color,
                                    strokes[i].lineWidth,
                                    strokes[i].points[j].x,
                                    strokes[i].points[j].y,
                                    strokes[i].points[j+1].x,
                                    strokes[i].points[j+1].y
                                );
                }
            }
            M.Logger.log('repaint', 'END');
        }
    });
    
    function resize(e){
        e.preventDefault();
    }

    function saveStrokes( x, y ) {
        strokes.push({points:[{x:x,y:y},{x:x+1,y:y+1}],color:foregroundColor,lineWidth:lineWidth});
        console.log(strokes);
    }

    // prototype to start drawing on touch using canvas moveTo and lineTo
    $.fn.drawTouch = function() {
        var start = function(e) {
            e = e.originalEvent;
            ctx.beginPath();
            ctx.strokeStyle = foregroundColor;
            x = e.changedTouches[0].pageX;
            y = e.changedTouches[0].pageY-44;
            ctx.moveTo(x,y);
            saveStrokes(x, y);
            M.Logger.log('new stroke');
        };
        var move = function(e) {
            e.preventDefault();
            e = e.originalEvent;
            x = e.changedTouches[0].pageX;
            y = e.changedTouches[0].pageY-44;
            ctx.lineTo(x,y);
            ctx.stroke();

            strokes[strokes.length-1].points.push({x:x,y:y});
        };
        $(this).on('touchstart', start);
        $(this).on('touchmove', move);
    };
        
    // prototype to start drawing on pointer(microsoft ie) using canvas moveTo and lineTo
    $.fn.drawPointer = function() {
        var start = function(e) {
            e = e.originalEvent;
            ctx.beginPath();
            ctx.strokeStyle = foregroundColor;
            x = e.pageX;
            y = e.pageY-44;
            ctx.moveTo(x,y);
            saveStrokes(x, y);
            M.Logger.log('new stroke');
        };
        var move = function(e) {
            e.preventDefault();
            e = e.originalEvent;
            x = e.pageX;
            y = e.pageY-44;
            ctx.lineTo(x,y);
            ctx.stroke();
           
            strokes[strokes.length-1].points.push({x:x,y:y});
        };
        $(this).on('MSPointerDown', start);
        $(this).on('MSPointerMove', move);
    };

    // prototype to start drawing on mouse using canvas moveTo and lineTo
    $.fn.drawMouse = function() {
        var clicked = 0;
        var start = function(e) {
            clicked = 1;
            ctx.beginPath();
            ctx.strokeStyle = foregroundColor;
            x = e.pageX;
            y = e.pageY-44;
            ctx.moveTo(x,y);
            saveStrokes(x, y);
            M.Logger.log('new stroke');
        };
        var move = function(e) {
            if(clicked){
                x = e.pageX;
                y = e.pageY-44;
                ctx.lineTo(x,y);
                ctx.stroke();

                strokes[strokes.length-1].points.push({x:x,y:y});
            }
        };
        var stop = function() {
            clicked = 0;
        };
        $(this).on('mousedown', start);
        $(this).on('mousemove', move);
        $(window).on('mouseup', stop);
    };

})();
