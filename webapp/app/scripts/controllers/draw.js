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

        strokesMin: 10,

        backgroundColor: '#123321',

        myRequestManager: "",

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
                    localStorage.setItem("Background", color.toHexString());
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
                    localStorage.setItem("Foreground", color.toHexString());
                }
            });

            // setup a new canvas for drawing wait for device init
            //setTimeout(function(){
                        
            this.newCanvas();

            this.myRequestManager = M.RequestManager.init({
                baseUrl: 'http://jebediah.pimp-my-wall.ch/',
                method: 'POST',
                timeout: 5000,
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
                            console.log('ERROR My Request Manager');
                        }
                    }
                }
            });
        },

        // Register menu item for this view
        /*registerToMenu: function( menuController ){
            menuController.registerMenuItem({
                value:M.I18N.l('draw.title'),
                goto:'draw'
            });
        },*/

        setBackgroundColor: function( color ){
            this.backgroundColor = color;           
            $('#contentCanvas canvas').css('background-color', this.backgroundColor);
        },

        newCanvas: function(){
            //define and resize canvas
            //$('#contentCanvas').height($(window).height()-100);
            canvas = '<canvas id="canvas" width="'+$(window).width()+'" height="'+($(window).height() - $(".toolbarview").height() - $('.tools').height())+'"></canvas>';
            $('#contentCanvas').html(canvas);


            canvas =  $('#contentCanvas canvas')[0];
    
            // setup canvas
            ctx = $('#contentCanvas canvas')[0].getContext('2d');

            window.addEventListener('resize', this.resizeCanvas, false);
            window.addEventListener('orientationchange', this.resizeCanvas, false);
            this.resizeCanvas();

            if(localStorage.getItem('Foreground'))
               ctx.strokeStyle = localStorage.getItem('Foreground');
            else
                ctx.strokeStyle = foregroundColor;

            ctx.lineWidth = lineWidth;
            if(localStorage.getItem('Background'))
                this.setBackgroundColor(localStorage.getItem('Background'));
            else
                this.setBackgroundColor(this.backgroundColor);
            
            // setup to trigger drawing on mouse or touch
            $('#contentCanvas canvas').drawTouch();
            $('#contentCanvas canvas').drawPointer();
            $('#contentCanvas canvas').drawMouse();

            if(localStorage.getItem("Strokes") != null){
                strokes = JSON.parse(localStorage.getItem("Strokes"));
                this.repaint();
            } else {    
                strokes = [];
            }
        },

        clearDraw: function(){
            localStorage.removeItem("Background");
            localStorage.removeItem("Strokes");
            localStorage.removeItem("Foreground");
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

            if ( confirm("Envoyer le dessin?") ){
                //$("#loading").css({visibility:"visible"});
                var current = this;
                var imageData = strokes;
                this.myRequestManager.doRequest({
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
                });
            }
        },
        shareFacebook: function() {
            $.ajaxSetup({ cache: true });
            $.getScript('//connect.facebook.net/en_UK/all.js', function(){
                FB.init({
                  appId: '1381340082121397',
                });     
                //FB.getLoginStatus(updateStatusCallback);

                // Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
                // for any authentication related change, such as login, logout or session refresh. This means that
                // whenever someone who was previously logged out tries to log in again, the correct case below 
                // will be handled. 
                FB.Event.subscribe('auth.authResponseChange', function(response) {
                    // Here we specify what we do with the response anytime this event occurs. 
                    if (response.status === 'connected') {
                      // The response object is returned with a status field that lets the app know the current
                      // login status of the person. In this case, we're handling the situation where they 
                      // have logged in to the app.
                      this.postToWall();
                    } else if (response.status === 'not_authorized') {
                      // In this case, the person is logged into Facebook, but not into the app, so we call
                      // FB.login() to prompt them to do so. 
                      // In real-life usage, you wouldn't want to immediately prompt someone to login 
                      // like this, for two reasons:
                      // (1) JavaScript created popup windows are blocked by most browsers unless they 
                      // result from direct interaction from people using the app (such as a mouse click)
                      // (2) it is a bad experience to be continually prompted to login upon page load.
                      FB.login();
                    } else {
                      // In this case, the person is not logged into Facebook, so we call the login() 
                      // function to prompt them to do so. Note that at this stage there is no indication
                      // of whether they are logged into the app. If they aren't then they'll see the Login
                      // dialog right after they log in to Facebook. 
                      // The same caveats as above apply to the FB.login() call here.
                      FB.login();
                    }
                });
            });
        },
            // Here we run a very simple test of the Graph API after login is successful. 
            // This testAPI() function is only called in those cases. 
        postToWall: function() {
            console.log('Post img to wall');
            var dataURL = canvas.toDataURL()
            var onlyData = dataURL.substring(dataURL.indexOf(',')+1, dataURL.length);
            var decoded = Base64Binary.decode(onlyData);
            var imageIwillPost = this.getFormData2(decoded, "dessin", "PimpMyWall.png");
            console.log(imageIwillPost);
            FB.api('/me/photos', 'POST',
                    {
                        'source': imageIwillPost,
                        'message': 'Mon dessin sur Pimp My Wall'
                    },
                    function(resp) {
                       console.log('into function');
                       if (resp && !resp.error) {
                         console.log('uploaded');
                         console.log(resp);
                       } else {
                         console.log('some error');
                         console.log(resp.error);}
                     }
                );
        },
        getFormData2: function(imageData, name, filename){
            var boundary = 'AaB03x';
            var formData = '';
            var formData = 'Content-Type: multipart/form-data; boundary=' + boundary + '\r\n';
            formData += '--' + boundary + '\r\n'
            formData += 'Content-Disposition: file; name="' + name + '"; filename="' + filename + '"\r\n';
            formData += 'Content-Type: ' + 'image/png' + '\r\n';
            formData += 'Content-Transfer-Encoding: binary'+ '\r\n';
            formData += '\r\n';
            for ( var i = 0; i < imageData.length; ++i ){
                formData += String.fromCharCode( imageData[ i ] & 0xff );
            }
            formData += '\r\n';
            formData += '--' + boundary + '--' + '\r\n';

            return formData;
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

        resizeCanvas: function() {
            console.log('resize');

            var ratio = 768/1024;

            var heightMargin = $(".toolbarview").height() + $('.tools').height();   

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
                ctx.clearRect(0, 0, canvas.width, canvas.height);
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
        localStorage.removeItem("Strokes");
        strokes.push({points:[{x:x,y:y},{x:x+1,y:y+1}],color:foregroundColor,lineWidth:lineWidth});
        localStorage.setItem("Strokes", JSON.stringify(strokes));
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
