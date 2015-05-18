/*global pmw, $*/

pmw.Controllers = pmw.Controllers || {};

(function (global) {
    'use strict';

    pmw.Controllers.ChooseFeatureController = pmw.Controllers.AbstractController.extend({

        pageHeadline: "Choisis un truc",

        _initViews: function() {
            backRoute = "/";
            // Create the ContentView with the controller (this) as scope
            if( !this.contentView ) {
                this.contentView = pmw.Views.ChooseFeatureView.create(this, null, true);
            }

            // Create the HeaderView with the controller (this) as scope
            if( !this.headerView ) {
                this.headerView = pmw.Views.BackheaderView.create(this, null, true);
            }

            this._applyViews();
			
			var that = this;
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
        },
        gotoPage: function( page ) {            

            pmw.navigate({
                route: '/' + page
            });

        }
    });

})(this);
