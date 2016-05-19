/*global pmw, $*/pmw.Controllers = pmw.Controllers || {};(function (global) {    'use strict';    var ctx, x, y = null;    var strokes;    var currentStroke = {};    var foregroundColor = '#94c13c';    var lineWidth = 10;    var canvas;        var darkenAt = 0;        var resolutionX = 1024;    var resolutionY = 1331;        var has_ws = false;    var websocketPipe = null;    function checkWebSocket(){        if (!(WebSocket = window.WebSocket || window.MozWebSocket)) {            has_ws = false;            return;        }        try{            ws = new WebSocket("ws:this-is-a-fake-url-i-hope-no-one-ever-registers-this-domain.fake-tld");            ws.close('');        }catch(e){ //throws code 15 if connection failed (which should be the case)            has_ws = true;            if ( window.MozWebSocket )                WebSocket = window.MozWebSocket;            websocketPipe = new WebSocket(global.pmw.options.liveDrawingUrl);            sendInterval = 3;            minTime = 1;        }    }        var oldX = 0;    var oldY = 0;        function beginStroke(x,y){        sendStroke(false);        oldX = x;        oldY = y;                var scale = resolutionX / ctx.canvas.width;                var newStroke = {dateStart:(new Date()),points:[{x:x * scale, y:y * scale}],color:foregroundColor,lineWidth:lineWidth};        currentStroke = newStroke;        strokes.push(newStroke);        drawLine(lineWidth / scale,foregroundColor,x,y,x+0.1,y+0.1);    }        var waitSend = 0;    var sendInterval = 3;    var minTime = 500;        function stroke(x,y){        var scale = resolutionX / ctx.canvas.width;                ctx.lineWidth = lineWidth;        ctx.strokeStyle = foregroundColor;        drawLine(lineWidth / scale, foregroundColor, oldX, oldY, x, y)        oldX = x;        oldY = y;                        var strokePart = {x:x,y:y};        var strokePartScaled = {x:x * scale, y:y * scale}                strokes[strokes.length-1].points.push(strokePartScaled);        currentStroke.points.push(strokePartScaled);                waitSend++;        if(waitSend > sendInterval){            sendStroke(true);            waitSend = 0;        }    }        function endStroke(){        sendStroke(false);    }        function sendStroke(intermediate){        if ( currentStroke == null || !currentStroke.points || currentStroke.points.length == 0 )            return;        if ( (new Date()).getTime() - currentStroke.dateStart.getTime() < minTime && intermediate)            return;        currentStroke.duration = ((new Date()).getTime() - currentStroke.dateStart.getTime())/1000;        delete currentStroke.dateStart;        if ( websocketPipe == null ){    	    $.ajax({    	        url: global.pmw.options.serverUrl + '/drawingLive',    	        type: 'post',    	        data: currentStroke,    	     });         }else{             websocketPipe.send(JSON.stringify(currentStroke));         }         if (intermediate){             currentStroke = {                 dateStart: new Date(),                 color: currentStroke.color,                 lineWidth: currentStroke.lineWidth,                 points:[                     {                         x: currentStroke.points[currentStroke.points.length-1].x,                         y: currentStroke.points[currentStroke.points.length-1].y                     }                 ]             };         }else{             currentStroke = null;         }    }        function drawLine(width, color, x1, y1, x2, y2){        ctx.save();        ctx.beginPath();        ctx.lineCap = 'round';        ctx.lineJoin = 'round';        ctx.strokeStyle = color;        ctx.lineWidth = width;        ctx.moveTo(x1,y1);        ctx.lineTo(x2,y2);        ctx.stroke();        ctx.restore();    }        function refreshPreview(){        var noCache = Math.round(Math.random()*100000)+1;        var backgroundImage = $("<img>").attr("src", global.pmw.options.serverUrl + "/screenshots/" + global.pmw.options.liveDrawingPreviewId + ".png?" + noCache + "=1");        backgroundImage.on("load", function (){            console.log("Background loaded!");            var canvasRatio = ctx.canvas.width / ctx.canvas.height;            var imgRatio = this.width / this.height;            var offsetX = 0;            var offsetY = 0;            var scaledX = 0;            var scaledY = 0;            if (canvasRatio < imgRatio){                // wider                var ratio = this.height / ctx.canvas.height;                scaledX = this.width / ratio;                scaledY = ctx.canvas.height;                offsetX = (scaledX - ctx.canvas.width) / 2 + 100;            } else if (canvasRatio > imgRatio){                // wider                var ratio = this.width / ctx.canvas.width;                scaledY = this.height * ratio;                scaledX = ctx.canvas.width;                offsetY = (scaledY - ctx.canvas.height) / 2;            }            ctx.drawImage(this,-offsetX,-offsetY ,scaledX,scaledY);        })    }    pmw.Controllers.DrawLiveController = pmw.Controllers.AbstractController.extend({        pageHeadline: 'Dessin temps-réel',        selectionSize: M.Model.create({size: 5}),        strokesMin: 10,                palette:                [                    ['FFFFFF','FF0000','94c13c','0000FF'],                    ['000000','964B00','07ace2','F57900'],                    ['e5287b','75507B','FCE94F','888888'],                ],                backgroundColor: null,        _initViews: function() {            checkWebSocket();            backRoute = "#chooseFace";            // Create the ContentView with the controller (this) as scope            if( !this.contentView ) {                this.contentView = pmw.Views.DrawLiveView.create(this, null, true);            }            // Create the HeaderView with the controller (this) as scope            if( !this.headerView ) {                this.headerView = pmw.Views.BackheaderView.create(this, null, true);            }                        this._applyViews();            var current = this;                        var flatPalette = [];            for(var i in this.palette){                for(var j in this.palette[i] ){                    flatPalette.push(this.palette[i][j]);                }            }            $('.colorpicker.foreground input').spectrum({                showPaletteOnly: true,                showPalette:true,                color: foregroundColor,                palette: current.palette,                change: function( color ) {                    foregroundColor = color.toHexString();                    localStorage.setItem('Foreground', color.toHexString());                }            });                        $('.selectionSize .selection-list').sizeChooser(this.changeSize);                                    this.newCanvas();            this.clearDraw();                        //var darkenInterval = setInterval(this.darken.bind(this,0.1),30);        },        newCanvas: function(){            canvas = '<canvas id="canvas" width="'+$(window).width()+'" height="'+($(window).height() - $('.toolbarview').height() - $('.tools').height())+'"></canvas>';            $('#contentCanvas').html(canvas);            canvas = $('#contentCanvas canvas')[0];                // setup canvas            ctx = $('#contentCanvas canvas')[0].getContext('2d');                        window.addEventListener('resize', this.resizeCanvas.bind(this), false);            window.addEventListener('orientationchange', this.resizeCanvas.bind(this), false);            this.resizeCanvas();            strokes = [];            ctx.strokeStyle = foregroundColor;            ctx.lineWidth = lineWidth;            ctx.lineCap = 'round';            ctx.lineJoin = 'round';                        $('#contentCanvas canvas').drawLiveTouch();            $('#contentCanvas canvas').drawLivePointer();            $('#contentCanvas canvas').drawLiveMouse();        },                darken: function(amount){            ctx.save();            darkenAt++;            if ( darkenAt == 30 ){                ctx.globalAlpha = 0.05                darkenAt = 0;            }else                ctx.globalAlpha = amount;                        ctx.fillStyle="#000";            ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);            ctx.restore();        },        clearDraw: function(){            var flatPalette = [];            for(var i in this.palette){                for(var j in this.palette[i] ){                    flatPalette.push(this.palette[i][j]);                }            }            this.newCanvas();            ctx.fillStyle="#000";            ctx.rect(0,0,ctx.canvas.width,ctx.canvas.height);            ctx.fill();        },        changeSize: function(){            var scale = ctx.canvas.width/resolutionX;            lineWidth = $('.selectionSize select').val();            ctx.lineWidth = lineWidth;        },        resizeCanvas: function() {            var ratio = resolutionY / resolutionX;            var winHeight = $(window).height();            var winWidth = $(window).width();            var newWidth = 0;            var newHeight = 0;            var heightMargin = $('.header').height() + $('.tools').height();            // windows size without header and footer            winHeight = winHeight - heightMargin;            if( winWidth/winHeight < 1/ratio) { // Portrait                newWidth = winWidth;                newHeight = newWidth * ratio;            } else { // landscape                newHeight = winHeight;                newWidth = newHeight / ratio;            }            $('#contentCanvas').width(newWidth);            $('#contentCanvas').height(winHeight);            canvas.width = newWidth;            canvas.height = newHeight;                        ctx.strokeStyle = foregroundColor;            ctx.lineWidth = lineWidth;            ctx.lineCap = 'round';            ctx.lineJoin = 'round';            this.repaint();        },                refreshPreview: function(){            refreshPreview();        },                repaint: function(){            if(strokes) {                ctx.fillStyle = this.backgroundColor;                ctx.clearRect(0, 0, canvas.width, canvas.height);                var scale = resolutionX / ctx.canvas.width;                                for(var i = 0; i < strokes.length; i++ ){                    for(var j = 0; j < strokes[i].points.length-1; j++ ){                        drawLine(strokes[i].lineWidth / scale,                                 strokes[i].color,                                 strokes[i].points[j].x / scale,                                 strokes[i].points[j].y / scale,                                 strokes[i].points[j+1].x / scale,                                 strokes[i].points[j+1].y / scale                        );                    }                }                                refreshPreview();            }            ctx.lineWidth = lineWidth;        },    });    // prototype to start drawing on touch using canvas moveTo and lineTo    $.fn.drawLiveTouch = function() {        var start = function(e) {            e = e.originalEvent;            x = e.changedTouches[0].pageX;            y = e.changedTouches[0].pageY-100;            beginStroke(x,y)        };        var move = function(e) {            e.preventDefault();            e = e.originalEvent;            x = e.changedTouches[0].pageX;            y = e.changedTouches[0].pageY-100;            stroke(x,y);        };        var stop = function(e){            endStroke();        }        $(this).on('touchstart', start.bind(this));        $(this).on('touchmove', move.bind(this));        $(this).on('touchend', stop.bind(this));    };            // prototype to start drawing on pointer(microsoft ie) using canvas moveTo and lineTo    $.fn.drawLivePointer = function() {        var start = function(e) {            e = e.originalEvent;            x = e.pageX;            y = e.pageY-100;            beginStroke(x,y);        };        var move = function(e) {            e.preventDefault();            e = e.originalEvent;            x = e.pageX;            y = e.pageY-100;            stroke(x,y);        };        var stop = function(e){            endStroke();        }        $(this).on('MSPointerDown', start);        $(this).on('MSPointerMove', move);        $(this).on('MSPointerUp', stop);    };    // prototype to start drawing on mouse using canvas moveTo and lineTo    $.fn.drawLiveMouse = function() {        var clicked = 0;        var start = function(e) {            x = e.pageX;            y = (e.pageY-100);            beginStroke(x,y);            clicked=1;        };        var move = function(e) {            if(clicked){                x = e.pageX;                y = (e.pageY-100);                stroke(x,y);            }        };        var stop = function() {            clicked = 0;            endStroke();        };        $(this).on('mousedown', start);        $(this).on('mousemove', move);        $(window).on('mouseup', stop);    };})(this);