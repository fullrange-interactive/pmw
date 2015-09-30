/*global pmw, $*/
pmw.Controllers = pmw.Controllers || {};

(function (global) {
    'use strict';
    
    var loader = null;
    var ctx = null;
    
    var imgWidth = 640;
    var imgHeight = 640;
    
    var margin = 30;
    var border = 5;
    var sendButtonSize = 50;
    
    var facebookAccountId = null;
    var shareMethod = null;
    var instagramToken = null;
    
    var photoUploaded = false;
    var photoUrl = null;
    
    var participateWasShown = false;
    
    function drawImageIOSFix (ctx, img) {
        var vertSquashRatio = detectVerticalSquash (img)
        var arg_count = arguments.length
        switch (arg_count) {
            case 4  : ctx.drawImage (img, arguments[2], arguments[3] / vertSquashRatio); break
            case 6  : ctx.drawImage (img, arguments[2], arguments[3], arguments[4], arguments[5] / vertSquashRatio); break
            case 8  : ctx.drawImage (img, arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7] / vertSquashRatio); break
            case 10 : ctx.drawImage (img, arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8], arguments[9] / vertSquashRatio); break
        }

        // Detects vertical squash in loaded image.
        // Fixes a bug which squash image vertically while drawing into canvas for some images.
        // This is a bug in iOS6 (and IOS7) devices. This function from https://github.com/stomita/ios-imagefile-megapixel
        function detectVerticalSquash (img) {
            var iw = img.naturalWidth, ih = img.naturalHeight
            var canvas = document.createElement ("canvas")
            canvas.width  = 1
            canvas.height = ih
            var ctx = canvas.getContext('2d')
            ctx.drawImage (img, 0, 0)
            var data = ctx.getImageData(0, 0, 1, ih).data
            // search image edge pixel position in case it is squashed vertically.
            var sy = 0, ey = ih, py = ih
            while (py > sy) {
                var alpha = data[(py - 1) * 4 + 3]
                if (alpha === 0) {ey = py} else {sy = py}
                py = (ey + sy) >> 1
            }
            var ratio = (py / ih)
            return (ratio === 0) ? 1 : ratio
        }
    }
    
    // Detect file input support for choosing a photo or taking a picture
    // Known bad players: 
    //   - Windows Phone 7 and 8.0 (8.1 is okay)
    //   - Some very old android 2 versions
    var isFileInputSupported = function () {
        // Handle devices which falsely report support
        if (navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/)) {
            return false;
        }
        // Create test element
        var el = document.createElement("input");
        el.type = "file";
        return !el.disabled;
    }
    
    // Detect FormData support for uploading files asynchronously
    // Known bad players: 
    //   - Android 2.x
    //   - Windows Phone 7 and 8.0 (no shit?)
    var isFormDataSupported = function (){
        if ( typeof(global.FormData) == "undefined" ){
            return false;
        }
        return true;
    }
    
    // Detect 
    var isFileReaderSupported = function (){
        return false;
        if ( typeof(global.FileReader) == "undefined" ){
            return false;
        }
        return true;
    }
    
    var modalAlert = function (text, hideOk, callback){
        if ( hideOk ){
            $(".ok-button").hide();
        }else{
            $(".ok-button").show();
        }
        $(".modal-alert-text").html(text);
        $(".modal-alert-container").addClass("shown");
        if ( callback ){
            $(".ok-button .button").bind("tap", function (){
                callback();
                $(".ok-button .button").unbind("tap")
            })
        }else{
            $(".ok-button .button").unbind("tap");
            $(".ok-button .button").bind("tap", function (){
                $(".modal-alert-container").removeClass("shown");
            });
        }
    }
    
    var getQueryParams = function (qs) {
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
    
    var getOS = function(){
        var info = new MobileDetect(window.navigator.userAgent);
        return info.os();
    }
    
    pmw.Controllers.PostPhotoController = pmw.Controllers.AbstractController.extend({

        pageHeadline: "Choisis un truc",
        
        loader: null,
        
        ctx: null,
        
        fbLoggedIn: false,

        _initViews: function() {
            
            getOS();
            if ( !isFormDataSupported() || !isFileInputSupported() ){
                alert("Malheureusement votre téléphone n'est pas assez récent et n'est pas compatible avec notre application.");
                // If file upload is not supported, there's absolutely no way for this app to work :(. Fuck Windows Phone 7, the worst phone OS ever made.
                return;
            }
            
            //backRoute = "/";
            // Create the ContentView with the controller (this) as scope
            if( !this.contentView ) {
                this.contentView = pmw.Views.PostPhotoView.create(this, null, true);
            }

            // Create the HeaderView with the controller (this) as scope
            if( !this.headerView ) {
                this.headerView =  M.ToolbarView.extend({
                    grid: 'col-md-12',
                    value: 'myBCVS'
                }).create();
            }

            this._applyViews();
            
            $(".page-post-photo .camera").prepend('<input type="file" capture="camera" accept="image/*" id="photo-file-input" >');
            $(".page-post-photo #photo-file-input").on("change", this.gotPhoto.bind(this));

            ctx = $("#post-photo-canvas").get()[0].getContext("2d");
            ctx.canvas.width = imgWidth;
            ctx.canvas.height = imgHeight;
            window.addEventListener('resize', this.resizeCanvas.bind(this), false);
            window.addEventListener('orientationchange', this.resizeCanvas.bind(this), false);
            this.resizeCanvas();
			
			var that = this;
            $("#loading-splash-screen").remove();
            
            if ( docCookies.hasItem("instagram-post") ){     
                var afterAnchor = docCookies.getItem("after-anchor");
                if ( afterAnchor == null ){
                    modalAlert("Pour participer, vous devez autoriser notre application à se connecter à Instagram!")
                }else{
                    var matches = afterAnchor.match(/^access_token=(.+?)$/);
                    if ( matches.length < 2 ){
                        modalAlert("Une erreur s'est produite lors de la connexion. Merci de ressayer.");
                        return;
                    }else{
                        instagramToken = matches[1];
                        shareMethod = "instagram";
                    }
                }
                $("#first-name input").val(docCookies.getItem("first-name"));
                $("#last-name input").val(docCookies.getItem("last-name"));
                $("#email input").val(docCookies.getItem("email"));
                $("#phone input").val(docCookies.getItem("phone"));
                photoUrl = docCookies.getItem("photo-url");
                this.showParticipate();
                docCookies.removeAll();
                loader = M.LoaderView.create().render().show();
                this.postParticipate();
            }
            
            global.fbAsyncInit = function() {
                FB.init({
                    appId      : '1381340082121397',
                    xfbml      : true,
                    version    : 'v2.4'
                });
                FB.getLoginStatus(function(response){
                    that.fbLoggedIn = (response.status == "connected");
                });
            };
            
            $(".save-picture-help").on("click tap", function(){
                modalAlert("Pour sauvegarder la photo: <ol class='text-left'><li>Laissez votre doigt appuyé longtemps sur la photo</li><li>Choisissez l'option 'Enregistrer l'image'</li></ol>")
            })
            
            this.checkDisabler();
        },
        
        resizeCanvas: function() {
            console.log('resize');

            var ratio = imgWidth / imgHeight;

            var winHeight = window.innerHeight ? window.innerHeight : $(window).height();
            var winWidth = $(window).width();
            var newWidth = 0;
            var newHeight = 0;
            var heightMargin = $('.toolbarview').height();

            // windows size without header and footer
            winHeight = winHeight - heightMargin;

            if( winWidth/winHeight < 1) { // Portrait
                newWidth = winWidth - margin * 2;
                newHeight = newWidth * ratio;
            } else { // landscape
                newHeight = winHeight - margin * 2;
                newWidth = newHeight / ratio;
            }            
            
            var canv = $("#post-photo-fake");
            canv.width(newWidth);
            canv.height(newHeight);
        
            var oy = -newHeight/2 - border/2;
            //console.log("resize = " + (winHeight/2 + newHeight / 2 > winHeight - sendButtonSize - margin * 2));
            if ( winHeight/2 + newHeight / 2 > winHeight - sendButtonSize - margin * 2 ){
                oy -=  (winHeight/2 + newHeight/2) - (winHeight - sendButtonSize - margin * 3.5);
            }
            //console.log("rrrr " + (winHeight/2 + oy));
        
            if ( winHeight/2 + oy < -20 ){
                oy = -newHeight/2 - border/2;
            }
        
            canv.css("margin-left", (-newWidth/2 - border/2) + "px");
            canv.css("margin-top", oy + "px")
            
            canv = $("#post-photo-canvas");
            canv.width(newWidth);
            canv.height(newHeight);
        
            var oy = -newHeight/2 - border/2;
            //console.log("resize = " + (winHeight/2 + newHeight / 2 > winHeight - sendButtonSize - margin * 2));
            if ( winHeight/2 + newHeight / 2 > winHeight - sendButtonSize - margin * 2 ){
                oy -=  (winHeight/2 + newHeight/2) - (winHeight - sendButtonSize - margin * 3.5);
            }
            //console.log("rrrr " + (winHeight/2 + oy));
        
            if ( winHeight/2 + oy < -20 ){
                oy = -newHeight/2 - border/2;
            }
        
            canv.css("margin-left", (-newWidth/2 - border/2) + "px");
            canv.css("margin-top", oy + "px")
            
        },
        
        gotPhoto: function (element){
            var photoPicker = $("#photo-file-input").get()[0];
            //console.log("A = " + JSON.stringify(photoPicker.files[0]));
            if ( !photoPicker.files || photoPicker.files.length == 0 ){
                modalAlert("Vous devez prendre une photo ou choisir une image pour participer.");
                return;
            }
            if ( isFileReaderSupported() ){
                //FileReader available, resize
                var reader = new global.FileReader();
                reader.onabort = this.abort;
                reader.onerror = this.error;
                reader.onload = this.readPhotoDone;
                reader.readAsDataURL(photoPicker.files[0]);
                loader = M.LoaderView.create().render().show();
            }else{
                // FileReader not available
                // TODO : Upload the file without resizing
                var fd = new FormData();
                var that = this;

                loader = M.LoaderView.create().render().show();
                fd.append("file", photoPicker.files[0]);
                $.ajax({
                    url: global.pmw.options.serverUrl + "/postPhoto",
                    type: "post",
                    data: fd,
                    processData: false,
                    contentType: false,
                    responseType: "json"
                }).done(function (data){
                    data = JSON.parse(data);
                    if ( data.error ){
                        modalAlert(data.error);
                    }
                    loader.hide();
                    photoUploaded = true;
                    var photoUrl = global.pmw.options.serverUrl + "/" + data.src.replace("public/","");
                    var obj = {result: global.pmw.options.serverUrl + "/" + data.src.replace("public/","")};
                    that.readPhotoDone.call(obj, {});
                }).fail(function (){
                    if ( loader )
                        loader.hide();
                    modalAlert("Une erreur s'est produite<br/>(connexion au serveur impossible)<br/>Mais ce n'est pas de votre faute! Veuillez ressayer plus tard.")
                });
            }
        },
        
        readPhotoDone: function (e, noExif){
            //Load the photo as an image
            var img = new Image();
            img.onload = function (){
                if ( loader != null )
                    loader.hide();
                
                //The photo was successfully loaded
                if ( !noExif ){
                    EXIF.getData(img, function (){
                        var orientation = EXIF.getTag(img, "Orientation");
                        if(navigator.userAgent.match(/Windows Phone/i)){
                            // Fuck you Windows Phone 8 and your fucked up
                            // EXIF rotation
                            switch (orientation) {
                            case 2:
                                // horizontal flip
                                ctx.translate(imgWidth, 0);
                                ctx.scale(-1, 1);
                                break;
                            case 3:
                                // 180° rotate left
                                ctx.translate(imgWidth, imgHeight);
                                ctx.rotate(Math.PI);
                                break;
                            case 4:
                                // vertical flip
                                ctx.translate(0, imgHeight);
                                ctx.scale(1, -1);
                                break;
                            case 5:
                                // vertical flip + 90 rotate right
                                ctx.rotate(-0.5 * Math.PI);
                                ctx.scale(1, -1);
                                break;
                            case 6:
                                // 90° rotate right
                                ctx.rotate(-0.5 * Math.PI);
                                ctx.translate(0, -imgHeight);
                                break;
                            case 7:
                                // horizontal flip + 90 rotate right
                                ctx.rotate(-0.5 * Math.PI);
                                ctx.translate(imgWidth, -imgHeight);
                                ctx.scale(-1, 1);
                                break;
                            case 8:
                                // 90° rotate left
                                ctx.rotate(0.5 * Math.PI);
                                ctx.translate(-imgWidth, 0);
                                break;
                            }
                        }else{
                            switch (orientation) {
                            case 2:
                                // horizontal flip
                                ctx.translate(imgWidth, 0);
                                ctx.scale(-1, 1);
                                break;
                            case 3:
                                // 180° rotate left
                                ctx.translate(imgWidth, imgHeight);
                                ctx.rotate(Math.PI);
                                break;
                            case 4:
                                // vertical flip
                                ctx.translate(0, imgHeight);
                                ctx.scale(1, -1);
                                break;
                            case 5:
                                // vertical flip + 90 rotate right
                                ctx.rotate(0.5 * Math.PI);
                                ctx.scale(1, -1);
                                break;
                            case 6:
                                // 90° rotate right
                                ctx.rotate(0.5 * Math.PI);
                                ctx.translate(0, -imgHeight);
                                break;
                            case 7:
                                // horizontal flip + 90 rotate right
                                ctx.rotate(0.5 * Math.PI);
                                ctx.translate(imgWidth, -imgHeight);
                                ctx.scale(-1, 1);
                                break;
                            case 8:
                                // 90° rotate left
                                ctx.rotate(-0.5 * Math.PI);
                                ctx.translate(-imgWidth, 0);
                                break;
                            }
                        }
                    })
                }
                
                
                var w = img.width;
                var h = img.height;
                var ox = 0;
                var oy = 0;
                if ( w > h ){
                    ox = (w - h)/2;
                    w = h;
                }else{
                    oy = (h - w)/2;
                    h = w;
                }

                $(".post-photo-help").hide();
                $(".page-post-photo .camera").hide();
                console.log("photoUploaded = " + photoUploaded)
                if ( !photoUploaded ){
                    $(".post-photo-canvas-wrapper").show();
                }else{
                    $(".post-photo-fake-wrapper").show();
                    $(".post-photo-fake-wrapper img").attr("src", this.src);
                    return;
                }
                
                drawImageIOSFix(ctx,this, ox, oy, w, h, 0, 0, imgWidth, imgHeight);
                
                var overlay = new Image();
                overlay.onload = function (){
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    ctx.drawImage(this, 0, 0, imgWidth, imgHeight, 0, 0, imgWidth, imgHeight);
                    loader.hide();
                }
                overlay.src = "images/overlay-3.png";
                
            }
            img.src = this.result;            
        },
        
        checkAllFields: function(){
            var ok = true;
            ok &= this.internalCheckField(this.contentView.childViews.participateForm.childViews.lastName);
            ok &= this.internalCheckField(this.contentView.childViews.participateForm.childViews.firstName);
            ok &= this.internalCheckField(this.contentView.childViews.participateForm.childViews.phone);
            ok &= this.internalCheckField(this.contentView.childViews.participateForm.childViews.email);
            if ( ok ){
                this.contentView.childViews.participateForm.childViews.submitFacebook.enable();
                this.contentView.childViews.participateForm.childViews.submitInstagram.enable();
            }else{
                this.contentView.childViews.participateForm.childViews.submitFacebook.disable();
                this.contentView.childViews.participateForm.childViews.submitInstagram.disable();                
            }
        },
        
        checkField: function (event, sender){
            if ( event.which == 13 ){
                if ( sender.$el.next().find("input").length != 0 )
                    sender.$el.next().find("input").focus();
                else{
                    sender.$el.find("input").blur();
                    console.log("blur "  + sender.$el.find("input"));
                }
            }
            sender.usedOnce = true;
            this.checkAllFields();
        },
        
        internalCheckField: function(sender){
            if ( !sender.getValue().trim().match(sender.regexp) ){
                if ( sender.usedOnce )
                    sender.$el.addClass("wrong");
                return false;
            }else{
                sender.$el.removeClass("wrong");
                return true;
            }
        },
        
        sendPhoto: function (){
            var that = this;
            if ( photoUploaded ){
                this.showParticipate();                
            }else{
                var base64Data = ctx.canvas.toDataURL('image/jpeg', 1);
                var format = "jpeg";
                if ( base64Data.substring(0,30).indexOf("image/png") != -1 ){
                    format = "png";
                }
                loader = M.LoaderView.create().render().show();
                $.post(global.pmw.options.serverUrl + "/postPhoto",
                    {
                        base64Image: base64Data,
                        imageFormat: format
                    }, function (data){
                        if ( loader != null )
                            loader.hide();
                        if ( data.error ){
                            modalAlert(data.error);
                            return;
                        }
                        photoUrl = global.pmw.options.serverUrl + "/" + data.src.replace("public/","");
                        that.showParticipate();
                    }, "json"
                ).fail(function (){
                    if ( loader != null )
                        loader.hide();
                    modalAlert("Une erreur s'est produite ... mais ce n'est pas de votre faute! Veuillez ressayer plus tard.")                    
                });
                // data:image/png;
            }
        },
        
        participateFacebook: function (){
            var that = this;
            loader = M.LoaderView.create().render().show();
            if ( !this.fbLoggedIn ){
                global.FB.login(function (response){
                    if ( response.authResponse ){
                        that.getFacebookData(that.postParticipate.bind(that));
                    }else{
                        modalAlert("Pour participer, vous devez autoriser notre application à se connecter à Facebook!")
                        loader.hide();
                    }
                }, {
                    enable_profile_selector: true,
                    scope: 'public_profile'
                })  
            }else{
                that.getFacebookData(that.postParticipate.bind(that));
            }
        },
        
        
        getFacebookData: function (callback){
            var that = this;
            FB.api('/me?fields=first_name,last_name,email', function(response){
                facebookAccountId = response.id;
                shareMethod = "facebook";
                callback();
            });
        },
        
        participateInstagram: function (){
            docCookies.setItem("instagram-post", true);
            docCookies.setItem("first-name", $("#first-name input").val());
            docCookies.setItem("last-name", $("#last-name input").val());
            docCookies.setItem("phone", $("#phone input").val());
            docCookies.setItem("email", $("#email input").val());
            docCookies.setItem("photo-url", photoUrl);
            window.location.replace(
                "https://instagram.com/oauth/authorize/?client_id=" 
                + global.pmw.options.instagramId 
                + "&redirect_uri=" 
                + encodeURIComponent(global.pmw.options.webappUrl)
                + "&response_type=token");
        },
        
                /*
        $accountId    = $_POST['accountId'];
        $accountType  = $_POST['accountType'] == 'Facebook' ? FACEBOOK : INSTAGRAM;  
        $firstName    = $_POST['firstName'];
        $lastName     = $_POST['lastName'];
        $phone        = $_POST['phone'];
        $email        = $_POST['email'];
        $originalUrl  = $_POST['imageUrl'];
        $token        = $_POST['token'];
                */
        
        postParticipate: function(){
            var that = this;
            var postData = {
                firstName: $("#first-name input").val(),
                lastName: $("#last-name input").val(),
                phone: $("#phone input").val(),
                email: $("#email input").val(),
                imageUrl: photoUrl
            }
            if(shareMethod == "facebook"){
                postData.accountId = facebookAccountId;
                postData.accountType = "Facebook";
            }else{
                postData.accountType = "Instagram";
                postData.token = instagramToken;
            }
            $.post(
                global.pmw.options.contestServerPostUrl,
                postData,
                function (data){
                    //data = data || {internalId:51};
                    if ( shareMethod == "facebook" ){
                        that.checkModerated(data.internalId);
                        loader.hide();
                        modalAlert("Votre photo doit encore être validée par notre équipe. Veuillez patentier...<br /><i class='fa fa-spinner fa-spin'></i>", true)
                    }else{
                        loader.hide();
                        that.finishInstagram();
                    }
                }
            ).fail(function (){

                that.finishInstagram();
                return;
                loader.hide();
                modalAlert("Une erreur s'est produite ... mais ce n'est pas de votre faute! Veuillez ressayer plus tard.")
            });
        },
        
        checkModerated: function (internalId){
            var that = this;
            $.get(global.pmw.options.contestServerStatusUrl, { id: internalId }, function (data){
                if ( data.moderated == 1 ){
                    modalAlert("Votre photo a été acceptée.<br><br>Pour gagner, partagez-la sur votre mur en appuyant sur OK", false, that.finishFacebook.bind(that,data));
                }else if ( data.moderated == -1 ){
                    modalAlert("Votre photo a été refusée!");
                }else{
                    setTimeout(that.checkModerated.bind(that,internalId), 1000);
                }
            });
        },
        
        finishFacebook: function (data){
            var that = this;
            global.FB.ui({
                method: 'share',
                href: data.postedUrl,
                type: 'touch'
            }, function(response){
                that.closeParticipate();
                modalAlert("Merci pour votre participation!<br><br>Encouragez vos amis à liker votre photo pour avoir plus de chances de gagner!", false, function(){
                    window.location.reload();
                });
            });
        },
        
        finishInstagram: function (){
            $(".share-instagram .user-photo-big img").attr("src", photoUrl);
            var os = getOS();
            if ( os == "AndroidOS" ){
                $(".share-instagram .screenshot-container .overlay img").attr("src", "images/instagram-android.png");
                $(".screenshot-container").addClass("android");
            }else if ( os == "WindowsPhoneOS" ){
                $(".share-instagram .screenshot-container .overlay img").attr("src", "images/instagram-windows-phone.png");
                $(".screenshot-container").addClass("windows-phone");
            }else{
                $(".share-instagram .screenshot-container .overlay img").attr("src", "images/instagram-ios.png");
                $(".screenshot-container").addClass("ios");
            }
            $(".share-instagram .screenshot-container .user-photo img").attr("src", photoUrl);
            $(".share-instagram").addClass("shown");
            this.closeParticipate();
            if ( loader )
                loader.hide();
        },
        
        cancelPhoto: function (){
            if ( confirm("Voulez-vous vraiment refaire votre selfie?") ){
                $(".post-photo-help").show();
                $(".post-photo-canvas-wrapper").hide();
                $(".post-photo-fake-wrapper").hide();
                $(".page-post-photo .camera").show();
            }
        },
        
        abort: function (){
            modalAlert("Opération annulée.");
        },
        
        error: function (e){
            modalAlert("Il y a eu une erreur, merci d'essayer plus tard. Erreur: " + e)
        },
        
        checkDisabler: function (){
            var that = this;
            $.get(global.pmw.options.contestServerStatusUrl, {status:1}, function(data){
                if ( data.status ){
                    this.hideDisabler();
                }else{
                    this.showDisabler();
                }
            }.bind(this))
            setTimeout(this.checkDisabler.bind(that), 30000);
        },
        
        showParticipate: function (){
            $(".participate-form").addClass("shown");
            $(".send").hide();
            this.checkAllFields();
            participateWasShown = true;
        },
        
        closeParticipate: function(forConditions){
            $(".participate-form").removeClass("shown"); 
            $(".send").show();
            if ( !forConditions )
                participateWasShown = false;
        },       
        
        showConditions: function (){
            this.closeParticipate(true);
            $(".conditions-text").addClass("shown");
        },
        
        closeConditions: function(){
            if ( participateWasShown )
                this.showParticipate();
            $(".conditions-text").removeClass("shown");
        },
        
        closeModalAlert: function(){
            $(".modal-alert-container").removeClass("shown");
        },
        
        closeInstagram: function (){
            $(".share-instagram").removeClass("shown");
        },
        
        openInstagramApp: function (){
            window.location.replace("instagram://camera");
        },
        
        showDisabler: function (){
            $(".disabler").show();
        },
        
        hideDisabler: function (){
            $(".disabler").hide();
        }
    });

})(this);
