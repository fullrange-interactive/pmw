/*global pmw, $*/

pmw.Controllers = pmw.Controllers || {};

(function () {
    'use strict';

    var ctx, x, y = null;

    var strokes;

    var foregroundColor = '#000000';

    var lineWidth = 10;

    var canvas;

    pmw.Controllers.DrawController = pmw.Controllers.AbstractController.extend({

        pageHeadline: M.I18N.get('draw.title'),

        selectionSize: M.Model.create({size: 5}),

        strokesMin: 10,
        
        palette:
                [
                    ['FFFFFF','FF0000','94c13c','0000FF'],
                    ['000000','964B00','07ace2','F57900'],
                    ['e5287b','75507B','FCE94F','888888'],
                    ['008800']
                ],
        
        backgroundColor: null,

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
            
            var flatPalette = [];
            for(var i in this.palette){
                for(var j in this.palette[i] ){
                    flatPalette.push(this.palette[i][j]);
                }
            }
            if ( !localStorage.getItem('Background') )
                this.backgroundColor = '#' + flatPalette[Math.floor(Math.random() * flatPalette.length)];

            $('.colorpicker.background input').spectrum({
                showPaletteOnly: true,
                showPalette:true,
                color: current.backgroundColor,
                palette: current.palette,
                change: function( color ) {
                    current.setBackgroundColor(color.toHexString());
                    localStorage.setItem('Background', color.toHexString());
                }
            });

            $('.colorpicker.foreground input').spectrum({
                showPaletteOnly: true,
                showPalette:true,
                color: foregroundColor,
                palette: current.palette,
                change: function( color ) {
                    foregroundColor = color.toHexString();
                    localStorage.setItem('Foreground', color.toHexString());
                }
            });
            
            $('.selectionSize .selection-list').sizeChooser(this.changeSize);
                        
            this.newCanvas();

            /*this.myRequestManager = M.RequestManager.init({
                baseUrl: 'http://jebediah.pimp-my-wall.ch/',
                method: 'POST',
                timeout: 10000,
                callbacks: {
                    beforeSend: {
                        action: function( obj ) {
                            obj.xhr.setRequestHeader("Accept", "application/json");
                            obj.xhr.setRequestHeader("Cache-Control", "no-cache");
                        }
                    },
                    error: {
                        action: function( obj ) {
                            // handle error globally
                            // (such as network error, timeout, parse error, ...)
                            console.log('ERROR My Request Manager : ');
                            console.log(obj);
                        }
                    }
                }
            });*/
        },

        setBackgroundColor: function( color ){
            this.backgroundColor = color;
            localStorage.setItem('Background', color);
            $('.colorpicker.background input').spectrum('set', color.replace('#',''));            
            //$('#contentCanvas canvas').css('background-color', this.backgroundColor);
            ctx.fillStyle = color; // set canvas background color
            ctx.fillRect(0, 0, canvas.width, canvas.height);  // now fill the canvas
            ctx.fillStyle = foregroundColor;
            this.repaint();
        },

        newCanvas: function(){
            //define and resize canvas
            //$('#contentCanvas').height($(window).height()-100);
            canvas = '<canvas id="canvas" width="'+$(window).width()+'" height="'+($(window).height() - $('.toolbarview').height() - $('.tools').height())+'"></canvas>';
            $('#contentCanvas').html(canvas);

            canvas = $('#contentCanvas canvas')[0];
    
            // setup canvas
            ctx = $('#contentCanvas canvas')[0].getContext('2d');
            

            window.addEventListener('resize', this.resizeCanvas, false);
            window.addEventListener('orientationchange', this.resizeCanvas, false);
            this.resizeCanvas();

            if(localStorage.getItem('Strokes') !== null){
                strokes = JSON.parse(localStorage.getItem('Strokes'));
                this.repaint();
            } else {
                strokes = [];
            }

            if(localStorage.getItem('Foreground'))
                ctx.strokeStyle = localStorage.getItem('Foreground');
            else
                ctx.strokeStyle = foregroundColor;

            ctx.lineWidth = lineWidth;
            
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            if(localStorage.getItem('Background'))
                this.setBackgroundColor(localStorage.getItem('Background'));
            else
                this.setBackgroundColor(this.backgroundColor);
            
            // setup to trigger drawing on mouse or touch
            $('#contentCanvas canvas').drawTouch();
            $('#contentCanvas canvas').drawPointer();
            $('#contentCanvas canvas').drawMouse();

            $('#facebook').click(postToWall);
        },

        clearDraw: function(){
            var flatPalette = [];
            for(var i in this.palette){
                for(var j in this.palette[i] ){
                    flatPalette.push(this.palette[i][j]);
                }
            }
            this.setBackgroundColor('#' + flatPalette[Math.floor(Math.random()*flatPalette.length)]);
            localStorage.removeItem('Background');
            localStorage.removeItem('Strokes');
            localStorage.removeItem('Foreground');
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
            var current = this;
            $('<div title="Confirmation">Envoyer le dessin ?</div>').dialog({
                              resizable: false,
                              height:200,
                              modal: true,
                              draggable: false,
                              buttons: {
                                Non: function() {
                                    $(this).dialog('close');
                                },
                                Oui: function() {
                                    var imageData = strokes;
                                    console.log(imageData);
                                    
                                    $.ajax({
                                        url:'http://baleinev.ch:443/drawing',
                                        type: 'post',
                                        data:{
                                            action:'newDrawing',
                                            strokes:imageData,
                                            width:canvas.width,
                                            height:canvas.height,
                                            backgroundColor: current.backgroundColor
                                        },
                                        }).done(function(data){
                                            data = jQuery.parseJSON(data);
                                            if(data.responseType == 'ok') {
                                                M.Toast.show('Ton dessin a été envoyé! Nos modérateurs vont y jeter un oeil.');
                                                $( "#messageBoxSocial" ).dialog({
                                                    resizable: false,
                                                    height:200,
                                                    modal: true,
                                                    draggable: false
                                                });
                                            } else {
                                                M.Toast.show('Erreur lors de l\'envoi ! :(');
                                            }
                                        });

                                        $(this).dialog('close');
                                    }
                                }
            });

            /*this.myRequestManager.doRequest({
                    path: '/drawing',
                    data: {
                        action:"newDrawing",
                        strokes:imageData,
                        width:$('#contentCanvas canvas').width,
                        height:$('#contentCanvas canvas').height,
                        backgroundColor: this.backgroundColor
                    },
                    callbacks: {
                        success: {
                            action: function( obj ) {
                                //var userDetails = obj.data;
                                // do something request specific
                                if(obj.responseType) {
                                    M.Toast.show('Dessin envoyé ! :)');
                                    if(confirm("Share to facebook ?"))
                                        this.shareFacebook();
                                }else
                                    M.Toast.show('Erreur lors de l envoi ! :(');
                            }
                        }
                    } 
                });*/

        },/*
        shareFacebook: function() {

            console.log('in shareFacebook');

            FB.getLoginStatus(function(response) {
                console.log(response.status);
                console.log(response);
                if (response.status === 'connected') {
                    console.log('post to wall in shareFacebook');
                    postToWall();
                } else {
                    $( "#messageBox" ).dialog({
                          resizable: false,
                          height:200,
                          modal: false,
                          close: postToWall
                    });              
                }
            });            
        },*/
        drawLine: function(color, width, x1, y1, x2, y2){
            ctx.beginPath();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            ctx.moveTo(x1,y1);
            ctx.lineTo(x2,y2);
            ctx.stroke();
            ctx.closePath();
        },

        resizeCanvas: function() {
            console.log('resize');

            var ratio = 1/1.206897;

            var winHeight = window.innerHeight ? window.innerHeight : $(window).height();
            var winWidth = $(window).width();
            var newWidth = 0;
            var newHeight = 0;
            var heightMargin = $('.toolbarview').height() + $('.tools').height();

            // windows size without header and footer
            winHeight = winHeight - heightMargin;

            if( winWidth/winHeight < 1) { // Portrait
                newWidth = winWidth;
                newHeight = newWidth * ratio;
            } else { // landscape
                newHeight = winHeight;
                newWidth = newHeight / ratio;
            }

            var imgData = ctx.getImageData(0,0, canvas.width, canvas.height);

            canvas.width = newWidth;
            canvas.height = newHeight;

            //$('#contentCanvas').width(newWidth);
            $('#contentCanvas').height(winHeight);

            ctx.putImageData(imgData, 0, 0);

            /*
            var imgData = ctx.getImageData(0,0, canvas.width, canvas.height);

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight - heightMargin;

            $('#contentCanvas').width(canvas.width);
            $('#contentCanvas').height(canvas.height);

            ctx.putImageData(imgData, 0, 0);

            /*var ratio = 768/1024;
            var winHeight = $(window).height();
            var winWidth = $(window).width();

            console.log(winWidth + "x" + winHeight);

            var ratioScreen = winWidth/winHeight;
            console.log("ratioScreen : " + ratioScreen);
            var newWidth, newHeight;
            if ( ratioScreen < 1 ) {
                newWidth = winWidth;
                newHeight = newWidth * ratio;
            } else {
                newHeight = winHeight;
                newWidth = newHeight * ratio;
            }*/

            //$('#contentCanvas canvas')[0].height = newHeight- 100;
            //$('#contentCanvas canvas')[0].width = newWidth;
        },

        repaint: function(){
            if(strokes) {
                ctx.fillStyle = this.backgroundColor;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillRect(0, 0, canvas.width, canvas.height);
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
            }
        }
    });

    function saveStrokes( x, y ) {
        localStorage.removeItem('Strokes');
        strokes.push({points:[{x:x,y:y},{x:x+1,y:y+1}],color:foregroundColor,lineWidth:lineWidth});
        localStorage.setItem('Strokes', JSON.stringify(strokes));
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
