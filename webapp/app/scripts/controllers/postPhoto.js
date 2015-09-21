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

    pmw.Controllers.PostPhotoController = pmw.Controllers.AbstractController.extend({

        pageHeadline: "Choisis un truc",
        
        loader: null,
        
        ctx: null,

        _initViews: function() {
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
        },
        
        resizeCanvas: function() {
            //console.log('resize');

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

            var canv = $("#post-photo-canvas");
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
                M.Toast.show("Vous devez prendre une photo ou choisir une image pour participer.");
                return;
            }
            if ( global.FileReader ){
                //FileReader available, resize
                var reader = new global.FileReader();
                reader.onabort = this.abort;
                reader.onerror = this.error;
                reader.onload = this.readPhotoDone;
                reader.readAsDataURL(photoPicker.files[0]);
                loader = M.LoaderView.create().render().show();
            }else{
                //FileReader not available
                //TODO : Upload the file without resizing
                console.log("FileReader unavailable :(");
            }
        },
        
        readPhotoDone: function (e){
            
            //Load the photo as an image
            var img = new Image();
            img.onload = function (){
                //The photo was successfully loaded
                EXIF.getData(img, function (){
                    var orientation = EXIF.getTag(img, "Orientation");
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
                })
                loader.hide();
                
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
                $(".post-photo-canvas-wrapper").show();
                $(".page-post-photo .camera").hide();
                
                ctx.drawImage(this, ox, oy, w, h, 0, 0, imgWidth, imgHeight);
            }
            img.src = this.result;            
        },
        
        abort: function (){
            M.Toast.show("Opération annulée.");
        },
        
        error: function (e){
            M.Toast.show("Il y a eu une erreur, merci d'essayer plus tard. Erreur: " + e)
        },
        
        showConditions: function (){
            $(".conditionsText").show();
        },
        
        closeConditions: function(){
            $(".conditionsText").hide();
        }
    });

})(this);
