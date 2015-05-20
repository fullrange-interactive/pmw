/*global pmw*/

pmw.Views = pmw.Views || {};

(function () {
    'use strict';

    pmw.Views.HomeView = M.View.extend({
        grid: 'row'
    }, {
        tower: M.ImageView.extend({
			grid: 'col-xs-6',
			cssClass: 'col-sm-4 col-md-3 text-center app-icon',
            value: 'images/tower.png',
            events: {
                    tap: function(){
                        this.setLocationAndChooseFeature('53562d9d3d45fe516a96d161');
                    }
            }
        }),
    	entrance: M.ImageView.extend({
			grid: 'col-xs-6',
			cssClass: 'col-sm-4 col-md-3 text-center app-icon',
    		value : 'images/entrance.png',
			events: {
				tap: function(){
					this.setLocationAndChooseFeature('553167e13452c2aeefa46bee');
				}
			}
    	}),
    	mainStage: M.ImageView.extend({
			grid: 'col-xs-6',
			cssClass: 'col-sm-4 col-md-3 text-center app-icon',
    		value : 'images/main-stage.png',
			events: {
				tap: function(){
					this.setLocationAndChooseFeature('55565afe8a8dbbeb37f4b1f1');
				}
			}
    	}),    	
		interior: M.ImageView.extend({
			grid: 'col-xs-6',
			cssClass: 'col-sm-4 col-md-3 text-center app-icon',
    		value : 'images/cafeteria.png',
			events: {
				tap: function(){
					this.setLocationAndChooseFeature('55565adc8a8dbbeb37f4b1f0');
				}
			}
    	})
    });

})();