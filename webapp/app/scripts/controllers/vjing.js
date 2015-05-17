/*global pmw, $*/

pmw.Controllers = pmw.Controllers || {};

(function (global) {
    'use strict';

    pmw.Controllers.VJingController = pmw.Controllers.AbstractController.extend({

        pageHeadline: M.I18N.get('vjing.title'),

        _initViews: function() {
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
			
			$("#vjing-gallery").on("touch",function(){
				$("#vjing-help").fadeOut();
			})
			$("#vjing-gallery").on("touchstart",function(){
				$("#vjing-help").fadeOut();
			})
			$("#vjing-gallery").on("click",function(){
				$("#vjing-help").fadeOut();
			})
			
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
				$("#send").css("pointer-events","none");
				$("#send").addClass("disabled");
				setTimeout(function(){
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
