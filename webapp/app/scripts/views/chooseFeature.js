/*global pmw*/

pmw.Views = pmw.Views || {};

(function () {
    'use strict';

    pmw.Views.ChooseFeatureView = M.View.extend({
        grid: 'row',
		cssClass: 'choose-feature'
    }, {
        draw: M.ImageView.extend({
			grid: 'col-xs-6',
			cssClass: 'col-sm-4 col-md-3 text-center app-icon',
            value: 'images/drawing.png',
            events: {
                    tap: function(){
                        this.gotoPage('draw');
                    }
            }
        }),
    	drawingPhoto: M.ImageView.extend({
			grid: 'col-xs-6',
			cssClass: 'col-sm-4 col-md-3 text-center app-icon',
    		value : 'images/drawingPhoto.png',
			events: {
				tap: function(){
					this.gotoPage('drawPhoto');
				}
			}
    	}),
    	vjing: M.ImageView.extend({
			grid: 'col-xs-6',
			cssClass: 'col-sm-4 col-md-3 text-center app-icon',
    		value : 'images/vjing.png',
			events: {
				tap: function(){
					this.gotoPage('vjing');
				}
			}
    	})
    });

})();