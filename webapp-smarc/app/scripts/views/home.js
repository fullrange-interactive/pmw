/*global pmw*/

pmw.Views = pmw.Views || {};

(function() {
    'use strict';

    pmw.Views.HomeView = M.View.extend({
        grid: 'row'
    }, {
        tower: M.ImageView.extend({
            grid: 'col-xs-6',
            cssClass: 'col-sm-4 col-md-3 text-center app-icon',
            value: 'images/tower.png',
            events: {
                tap: function() {
                    this.setLocationAndChooseFeature('53562d9d3d45fe516a96d161');
                }
            }
        }),
        entrance: M.ImageView.extend({
            grid: 'col-xs-6',
            cssClass: 'col-sm-4 col-md-3 text-center app-icon',
            value: 'images/entrance.png',
            events: {
                tap: function() {
                    this.setLocationAndChooseFeature('53562d9d3d45fe516a96d161');
                }
            }
        }),
        mainStage: M.ImageView.extend({
            grid: 'col-xs-6',
            cssClass: 'col-sm-4 col-md-3 text-center app-icon',
            value: 'images/main-stage.png',
            events: {
                tap: function() {
                    this.setLocationAndChooseFeature('53562d9d3d45fe516a96d161');
                }
            }
        }),
        interior: M.ImageView.extend({
            grid: 'col-xs-6',
            cssClass: 'col-sm-4 col-md-3 text-center app-icon',
            value: 'images/cafeteria.png',
            events: {
                tap: function() {
                    this.setLocationAndChooseFeature('53562d9d3d45fe516a96d161');
                }
            }
        })
    });

})();
