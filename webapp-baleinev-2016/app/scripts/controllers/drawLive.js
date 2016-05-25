/*global pmw, $*/pmw.Controllers = pmw.Controllers || {};(function (global) {    'use strict';    var ctx, x, y = null;    var strokes;    var currentStroke = {};    var palette = [                    ['FFFFFF','FF0000','94c13c','0000FF'],                    ['000000','964B00','07ace2','F57900'],                    ['e5287b','75507B','FCE94F','888888'],                ];    var randRow = Math.floor(Math.random() * palette.length);    var foregroundColor = "#" + palette[randRow][Math.floor(Math.random() * palette[randRow].length)];    var lineWidth = 0.003;    var canvas;        var darkenAt = 0;    var windowParams = {};    var windowParamsList = {        tower: {            width: 13636,            height: 12312,            mask: "images/mask-full-tower.png"        },        window: {            width: 3106,            height: 2539,            mask: "images/mask-single-window.png"        }    }    /*    var windowParams = {        resolutionX: 4258,        resolutionY: 4108,        mask: "mask-full-tower.png",        brushSizes: [3, 10, 20, 30]    }    */    // For just a window    // var resolutionX = 295;    // var resolutionY = 261;        var has_ws = false;    var websocketPipe = null;    function checkWebSocket(){        if (!(WebSocket = window.WebSocket || window.MozWebSocket)) {            has_ws = false;            return;        }        try{            ws = new WebSocket("ws:this-is-a-fake-url-i-hope-no-one-ever-registers-this-domain.fake-tld");            ws.close('');        }catch(e){ //throws code 15 if connection failed (which should be the case)            has_ws = true;            if ( window.MozWebSocket )                WebSocket = window.MozWebSocket;            websocketPipe = new ReconnectingWebSocket(global.pmw.options.liveDrawingUrl);            sendInterval = 3;            minTime = 1;        }    }        var oldX = 0;    var oldY = 0;    function sx(x) {        console.log(windowParams.scaleX);        return x / $(canvas).outerWidth() * windowParams.scaleX + windowParams.originX;    }    function sy(y) {        return y / $(canvas).outerHeight() * windowParams.scaleY + windowParams.originY;    }    function ss(s) {        return s * windowParams.scaleX;    }    function beginStroke(x,y){        sendStroke(false);        oldX = x;        oldY = y;        var strokePartNormalized = {            x: sx(x),             y: sy(y)        };                var newStroke = {            dateStart:(new Date()),            points:[strokePartNormalized],            color:foregroundColor,            lineWidth:ss(lineWidth)        };        currentStroke = newStroke;        strokes.push(newStroke);        drawLine(lineWidth * $(canvas).outerWidth(), foregroundColor, x, y, x + 0.1, y + 0.1);    }        var waitSend = 0;    var sendInterval = 3;    var minTime = 500;        function stroke(x,y){                ctx.lineWidth = lineWidth;        ctx.strokeStyle = foregroundColor;        drawLine(lineWidth * $(canvas).outerWidth(), foregroundColor, oldX, oldY, x, y)        oldX = x;        oldY = y;                var strokePart = {x: x, y: y};        var strokePartNormalized = {            x: sx(x),             y: sy(y)        }                strokes[strokes.length-1].points.push(strokePartNormalized);        currentStroke.points.push(strokePartNormalized);                waitSend++;        if(waitSend > sendInterval){            sendStroke(true);            waitSend = 0;        }    }        function endStroke(){        sendStroke(false);    }        function sendStroke(intermediate){        if ( currentStroke == null || !currentStroke.points || currentStroke.points.length == 0 )            return;        if ( (new Date()).getTime() - currentStroke.dateStart.getTime() < minTime && intermediate)            return;        currentStroke.duration = ((new Date()).getTime() - currentStroke.dateStart.getTime())/1000;        delete currentStroke.dateStart;        if ( websocketPipe == null ){    	    $.ajax({    	        url: global.pmw.options.serverUrl + '/drawingLive',    	        type: 'post',    	        data: currentStroke,    	     });         }else{             websocketPipe.send(JSON.stringify(currentStroke));         }         if (intermediate){             currentStroke = {                 dateStart: new Date(),                 color: currentStroke.color,                 lineWidth: currentStroke.lineWidth,                 points:[                     {                         x: currentStroke.points[currentStroke.points.length-1].x,                         y: currentStroke.points[currentStroke.points.length-1].y                     }                 ]             };         }else{             currentStroke = null;         }    }        function drawLine(width, color, x1, y1, x2, y2){        ctx.save();        ctx.beginPath();        ctx.lineCap = 'round';        ctx.lineJoin = 'round';        ctx.strokeStyle = color;        ctx.lineWidth = width;        ctx.moveTo(x1,y1);        ctx.lineTo(x2,y2);        ctx.stroke();        ctx.restore();    }        function refreshPreview(){        var noCache = Math.round(Math.random()*100000)+1;        var backgroundImage = $("<img>").attr("src", global.pmw.options.serverUrl + "/screenshots/" + global.pmw.options.liveDrawingPreviewImage + "?" + noCache + "=1");        backgroundImage.on("load", function (){            console.log("Background loaded!");            var canvasRatio = windowParamsList.tower.width / windowParamsList.tower.height;            var imgRatio = this.width / this.height;            var offsetX = 0;            var offsetY = 0;            var scaledX = 0;            var scaledY = 0;            console.log("Image size = w:" + this.width + " h:" + this.height + " ")            console.log("Canvas size = w:" + ctx.canvas.width + " h:" + ctx.canvas.height);            if (imgRatio > canvasRatio){                // Image is wider                console.log("wider")                scaledX = this.height * canvasRatio;                scaledY = this.height;                offsetX = (this.width - scaledX) / 2;            } else if (canvasRatio > imgRatio){                // Image is taller                scaledY = this.width / canvasRatio;                scaledX = this.width;                offsetY = (this.height - scaledY) / 2;            }            console.log("scaledX:" + scaledX + " scaledY:" + scaledY + " offsetX:" + offsetX + " offsetY:" + offsetY)            offsetX += windowParams.originX * scaledX;            offsetY += windowParams.originY * scaledY;            scaledX *= windowParams.scaleX;            scaledY *= windowParams.scaleY;            console.log(windowParams)            console.log("scaledX:" + scaledX + " scaledY:" + scaledY + " offsetX:" + offsetX + " offsetY:" + offsetY)            ctx.drawImage(this, Math.floor(offsetX), Math.floor(offsetY), Math.floor(scaledX), Math.floor(scaledY), 0, 0, ctx.canvas.width, ctx.canvas.height);        })    }    pmw.Controllers.DrawLiveController = pmw.Controllers.AbstractController.extend({        pageHeadline: 'Art Tower',        selectionSize: M.Model.create({size: 5}),        strokesMin: 10,                backgroundColor: null,        constructor: function(fullTower, isArtist) {            this.fullTower = fullTower;            console.log(arguments);        },        _initViews: function(fullTower) {            var swd = global.pmw.options.selectedWindowData;            if (!swd && this.fullTower !== true) {                this.gotoPage("chooseWindow");                return;            }            checkWebSocket();            backRoute = "#chooseWindow";            // Create the ContentView with the controller (this) as scope            if( !this.contentView ) {                this.contentView = pmw.Views.DrawLiveView.create(this, null, true);                console.log(this.contentView);                this.contentView.onClose = function (){                    console.log("good bye");                }            }            // Create the HeaderView with the controller (this) as scope            if( !this.headerView ) {                this.headerView = pmw.Views.BackheaderView.create(this, null, true);            }                        this._applyViews();            var current = this;                        var flatPalette = [];            for(var i in this.palette){                for(var j in this.palette[i] ){                    flatPalette.push(this.palette[i][j]);                }            }            $('.colorpicker.foreground input').spectrum({                showPaletteOnly: true,                showPalette:true,                color: foregroundColor,                palette: current.palette,                change: function( color ) {                    foregroundColor = color.toHexString();                    localStorage.setItem('Foreground', color.toHexString());                }            });            $('.selectionSize .selection-list').sizeChooser(this.changeSize);            if (this.fullTower === true ){                windowParams = windowParamsList.tower;                windowParams.originX = 0;                windowParams.originY = 0;                windowParams.scaleX = 1;                windowParams.scaleY = 1;            } else {                windowParams = windowParamsList.window;                var nMarginsX = swd.x * 2;                var nMarginsY = swd.y * 2;                var posX = nMarginsX * windowParams.width * swd.windowModel.margin.x + swd.x * windowParams.width;                var posY = nMarginsY * windowParams.height * swd.windowModel.margin.y + swd.y * windowParams.height;                console.log(posX);                windowParams.originX = posX / windowParamsList.tower.width;                windowParams.originY = posY / windowParamsList.tower.height;                windowParams.scaleX = windowParams.width / windowParamsList.tower.width;                windowParams.scaleY = windowParams.height / windowParamsList.tower.height;            }                                    this.newCanvas();            this.clearDraw();            console.log("init");            this.getCanvasBounds();            if (this.fullTower !== true) {                this.beginCheckArtistIsLive();            }        },        beginCheckArtistIsLive: function () {            function checkArtistIsLive() {                $.get(global.pmw.options.serverUrl + "/option?name=artistIsLive", function (option){                    if (option.data.isLive === true) {                        $(".reserved-message .artist-name").html(option.data.artistName);                        $(".reserved-message").addClass("active");                    } else {                        $(".reserved-message").removeClass("active");                    }                });            }            if (typeof this.checkArtistIsLiveInterval === 'undefined') {                this.checkArtistIsLiveInterval = setInterval(checkArtistIsLive.bind(this), 10000);                checkArtistIsLive.call(this);            }                    },        startTest: function () {            var w = $(canvas).width();            var h = $(canvas).height();            var testData = {                x: Math.random() * w,                y: Math.random() * y,                vx: Math.random() * 2,                vy: Math.random() * 2            };            var strokeStarted = false;            function nextTestPoint(){                if (!strokeStarted ) {                    testData = {                        x: Math.random() * w,                        y: Math.random() * h,                        vx: Math.random() * 2 - 1,                        vy: Math.random() * 2 - 1                    };                    var randRow = Math.floor(Math.random() * palette.length);                    foregroundColor = "#" + palette[randRow][Math.floor(Math.random() * palette[randRow].length)];                    lineWidth = Math.random() * 0.05 + 0.003;                    beginStroke(testData.x, testData.y);                    strokeStarted = true;                } else {                    if (Math.random() < 0.01){                        endStroke();                        strokeStarted = false                        return;                    }                    testData.x += testData.vx * 3;                    testData.y += testData.vy * 3;                    testData.vx += Math.random() * 0.5 - 0.25;                    testData.vy += Math.random() * 0.5 - 0.25;                    if (testData.x > w){                        testData.vx *= -1;                        testData.x = w - 10;                    }                    if (testData.x < 0){                        testData.vx *= -1;                        testData.x = 10;                    }                    if (testData.y > h){                        testData.vy *= -1;                        testData.y = h - 10;                    }                    if (testData.y < 0){                        testData.vy *= -1;                        testData.y = 10;                    }                    stroke(testData.x, testData.y)                }            }            setInterval(nextTestPoint, 30);        },        getCanvasBounds: function() {               this.canvasOriginY = $(canvas).offset().top;            this.canvasOriginX = $(canvas).offset().left;        },        newCanvas: function(){            canvas = '<canvas id="canvas" width="'+$(window).width()+'" height="'+($(window).height() - $('.toolbarview').height() - $('.tools').height())+'"></canvas><div class="after"></div>';            $('#contentCanvas').html(canvas);            canvas = $('#contentCanvas canvas')[0];                // setup canvas            ctx = $('#contentCanvas canvas')[0].getContext('2d');            window.addEventListener('resize', this.resizeCanvas.bind(this), false);            window.addEventListener('orientationchange', this.resizeCanvas.bind(this), false);            this.resizeCanvas();            strokes = [];            ctx.strokeStyle = foregroundColor;            ctx.lineWidth = lineWidth;            ctx.lineCap = 'round';            ctx.lineJoin = 'round';                        $('#contentCanvas canvas').drawLiveTouch(this);            $('#contentCanvas canvas').drawLivePointer(this);            $('#contentCanvas canvas').drawLiveMouse(this);            this.getCanvasBounds();        },                darken: function(amount){            ctx.save();            darkenAt++;            if ( darkenAt == 30 ){                ctx.globalAlpha = 0.05                darkenAt = 0;            }else                ctx.globalAlpha = amount;                        ctx.fillStyle = "#000";            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);            ctx.restore();        },        clearDraw: function(){            var flatPalette = [];            for(var i in this.palette){                for(var j in this.palette[i] ){                    flatPalette.push(this.palette[i][j]);                }            }            this.newCanvas();            ctx.fillStyle="#000";            ctx.rect(0,0,ctx.canvas.width,ctx.canvas.height);            ctx.fill();        },        changeSize: function(){            var scale = ctx.canvas.width / windowParams.width;            lineWidth = $('.selectionSize select').val() / 1000.0;            ctx.lineWidth = lineWidth;        },        resizeCanvas: function() {            console.log("resize");            var ratio = windowParams.height / windowParams.width;            $("#contentCanvas .after").css({                backgroundImage: "url(" + windowParams.mask + ")"            });            var winHeight = $(window).height();            var winWidth = $(window).width();            var newWidth = 0;            var newHeight = 0;            var heightMargin = $('.header').height() + $('.tools').height();            // windows size without header and footer            winHeight = winHeight - heightMargin;            if( winWidth/winHeight < 1/ratio) { // Portrait                newWidth = winWidth;                newHeight = newWidth * ratio;            } else { // Landscape                newHeight = winHeight;                newWidth = newHeight / ratio;            }            $('#contentCanvas').width(newWidth);            $('#contentCanvas').height(newHeight);            canvas.width = newWidth;            canvas.height = newHeight;                        ctx.strokeStyle = foregroundColor;            ctx.lineWidth = lineWidth;            ctx.lineCap = 'round';            ctx.lineJoin = 'round';            this.repaint();        },                refreshPreview: function(){            refreshPreview();        },                repaint: function(){            if(strokes) {                ctx.fillStyle = this.backgroundColor;                ctx.clearRect(0, 0, canvas.width, canvas.height);                var scale = windowParams.width / ctx.canvas.width;                                for(var i = 0; i < strokes.length; i++ ){                    for(var j = 0; j < strokes[i].points.length - 1; j++ ){                        drawLine(strokes[i].lineWidth / scale,                                 strokes[i].color,                                 strokes[i].points[j].x / scale,                                 strokes[i].points[j].y / scale,                                 strokes[i].points[j+1].x / scale,                                 strokes[i].points[j+1].y / scale                        );                    }                }                refreshPreview();            }            ctx.lineWidth = lineWidth;        },        gotoPage: function(page) {            pmw.navigate({                route: '/' + page            });        }    });    // prototype to start drawing on touch using canvas moveTo and lineTo    $.fn.drawLiveTouch = function(controller) {        var start = function(e) {            controller.getCanvasBounds();            e = e.originalEvent;            x = e.changedTouches[0].pageX - controller.canvasOriginX;            y = e.changedTouches[0].pageY - controller.canvasOriginY;            beginStroke(x, y)        };        var move = function(e) {            e.preventDefault();            e = e.originalEvent;            x = e.changedTouches[0].pageX - controller.canvasOriginX;            y = e.changedTouches[0].pageY - controller.canvasOriginY;            stroke(x, y);        };        var stop = function(e) {            endStroke();        };        $(this).on('touchstart', start.bind(this));        $(this).on('touchmove', move.bind(this));        $(this).on('touchend', stop.bind(this));    };            // prototype to start drawing on pointer(microsoft ie) using canvas moveTo and lineTo    $.fn.drawLivePointer = function(controller) {        var start = function(e) {            controller.getCanvasBounds();            e = e.originalEvent;            x = e.pageX - controller.canvasOriginX;            y = e.pageY - controller.canvasOriginY;            beginStroke(x, y);        };        var move = function(e) {            e.preventDefault();            e = e.originalEvent;            x = e.pageX - controller.canvasOriginX;            y = e.pageY - controller.canvasOriginY;            stroke(x, y);        };        var stop = function(e){            endStroke();        }        $(this).on('MSPointerDown', start);        $(this).on('MSPointerMove', move);        $(this).on('MSPointerUp', stop);    };    // prototype to start drawing on mouse using canvas moveTo and lineTo    $.fn.drawLiveMouse = function(controller) {        var clicked = 0;        var start = function(e) {            controller.getCanvasBounds();            x = e.pageX - controller.canvasOriginX;            y = e.pageY - controller.canvasOriginY;            beginStroke(x,y);            clicked=1;        };        var move = function(e) {            if(clicked){                x = e.pageX - controller.canvasOriginX;                y = e.pageY - controller.canvasOriginY;                stroke(x,y);            }        };        var stop = function() {            clicked = 0;            endStroke();        };        $(this).on('mousedown', start);        $(this).on('mousemove', move);        $(window).on('mouseup', stop);    };})(this);