/*global pmw*/

pmw.Views = pmw.Views || {};

(function () {
    'use strict';

    pmw.Views.HomeView = M.View.extend({
        grid: 'row'
    }, {
        draw: M.ImageView.extend({
			grid: 'col-xs-6',
			cssClass: 'text-center',
            value: 'images/drawing.jpg',
            events: {
                    tap: function(){
                        this.gotoPage('draw');
                    }
            }
        }),
    	drawingPhoto: M.ImageView.extend({
			grid: 'col-xs-6',
			cssClass: 'text-center',
    		value : 'images/drawingPhoto.jpg',
			events: {
				tap: function(){
					this.gotoPage('drawingPhoto');
				}
			}
    	}),
    	vjing: M.ImageView.extend({
			grid: 'col-xs-6',
			cssClass: 'text-center',
    		value : 'images/vjing.jpg',
			events: {
				tap: function(){
					this.gotoPage('vjing');
				}
			}
    	})
    });

})();