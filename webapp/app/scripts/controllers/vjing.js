/*global pmw, $*/

pmw.Controllers = pmw.Controllers || {};

(function (global) {
    'use strict';

    var helpGone = false;
    var canSend = true;

    pmw.Controllers.VJingController = pmw.Controllers.AbstractController.extend({

        pageHeadline: M.I18N.get('vjing.title'),

        _initViews: function() {
            backRoute = "#chooseFeature";
            // Create the ContentView with the controller (this) as scope
            if( !this.contentView ) {
                this.contentView = pmw.Views.VJingView.create(this, null, true);
            }

            // Create the HeaderView with the controller (this) as scope
            if( !this.headerView ) {
                this.headerView = pmw.Views.BackheaderView.create(this, null, true);
            }

            this._applyViews();
			
			var that = this;
			$.get(global.pmw.options.serverUrl+"/vjing", {
				listImages:1
			},function (data){
				that.vjImages = data;
				that.fillGallery(that);
				$("#vjing-gallery").swipeshow({
					autostart: false
				});
			},'json');

            window.addEventListener('resize', this.resizeCanvas, false);
            window.addEventListener('orientationchange', this.resizeCanvas, false);
			
            this.resizeCanvas();
            
            $("#vjing-gallery .slides").on("tap",function(e){
                e.preventDefault();
                if ( helpGone === true ){
                    this.sendClip();
                }
            }.bind(this));
			
			$("#vjing-gallery").on("touch",function(){
				$("#vjing-help").fadeOut(500,function(){helpGone = true;console.log("helpgone")});
			})
			$("#vjing-gallery").on("touchstart",function(){
				$("#vjing-help").fadeOut(500,function(){helpGone = true;console.log("helpgone")});
			})
			$("#vjing-gallery").on("click",function(){
				$("#vjing-help").fadeOut(500,function(){helpGone = true;console.log("helpgone")});
			})
            setTimeout(function (){
                $("#vjing-help").fadeOut(500,function(){helpGone = true;console.log("helpgone")});
            },3000)
			
			setTimeout(function(){
				$("#vjing-gallery").trigger("resize");
			},100)
            var current = this;
        },
		
		fillGallery: function(){
			for(var i = 0; i < this.vjImages.length; i++){
				var slide = $("<li>");
				slide.addClass("slide");
				slide.html('<img src="' + global.pmw.options.serverUrl + this.vjImages[i] + '"/>')
				$("#vjing-gallery").find(".slides").append(slide)
			}
		},
		
        sendClip: function(){
            if ( !canSend ){
                return;
            }
            canSend = false;
            var current = this;
			var selectedClip;
			$("#vjing-gallery .slides").find("li").each(function (){
				if ( $(this).hasClass("active") ){
					selectedClip = $(this).find("img").attr("src");
				}
			})
		    $.ajax({
		        url:global.pmw.options.serverUrl+"/vjing",
		        type: 'post',
		        data:{
		            clip:selectedClip,
					groupId:global.pmw.selectedWindowGroup
		        },
	        }).done(function (data){
                data = JSON.parse(data);
                if ( data.responseType == "ok" ){
	                M.Toast.show("Ta boucle a été envoyée! Lève les yeux.");
                }else{
                    M.Toast.show("Erreur :( Es-tu toujours connecté à internet?");
                    return;
                }
				$("#send").css("pointer-events","none");
				$("#send").addClass("disabled");
				setTimeout(function(){
                    canSend = true;
					$("#send").css("pointer-events","all");
					$("#send").removeClass("disabled");
				},2000)
			});
        },
		
        resizeCanvas: function() {
            var winHeight = window.innerHeight ? window.innerHeight : $(window).height();
            var winWidth = $(window).width();
            var newWidth = 0;
            var newHeight = 0;
            var heightMargin = $('.toolbarview').height() + $('.tools').height();

            // windows size without header and footer
            winHeight = winHeight - heightMargin;

            $('#vjing-gallery').height(winHeight);
        }
    });

})(this);
