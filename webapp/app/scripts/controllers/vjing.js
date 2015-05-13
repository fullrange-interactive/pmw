/*global pmw, $*/

pmw.Controllers = pmw.Controllers || {};

(function () {
    'use strict';

    pmw.Controllers.VJingController = pmw.Controllers.AbstractController.extend({

        pageHeadline: M.I18N.get('vjing.title'),
		
		vjImages: [
			'1.gif', '2.gif', '3.gif'
		],

        _initViews: function() {
			console.log("AAAEER")
            // Create the ContentView with the controller (this) as scope
            if( !this.contentView ) {
                this.contentView = pmw.Views.VJingView.create(this, null, true);
            }

            // Create the HeaderView with the controller (this) as scope
            if( !this.headerView ) {
                this.headerView = pmw.Views.BackheaderView.create(this, null, true);
            }

            this._applyViews();
			this.fillGallery();

            window.addEventListener('resize', this.resizeCanvas, false);
            window.addEventListener('orientationchange', this.resizeCanvas, false);
			
            this.resizeCanvas();
			
			$("#vjing-gallery").swipeshow({
				autostart: false
			});
			
			setTimeout(function(){
				$("#vjing-gallery").trigger("resize");
			},100)
            var current = this;
        },
		
		fillGallery: function(){
			for(var i = 0; i < this.vjImages.length; i++){
				var slide = $("<li>");
				slide.addClass("slide");
				slide.html('<img src="images/vjing/' + this.vjImages[i] + '"/>')
				$("#vjing-gallery").find(".slides").append(slide)
			}
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

})();
