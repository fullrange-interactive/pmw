/*global pmw*/

pmw.Views = pmw.Views || {};

(function() {
    'use strict';

    pmw.Views.ChooseFaceView = M.View.extend({
        grid: 'row',
        cssClass: 'choose-face'
    }, {
        front: M.View.extend({
            grid: 'col-xs-6',
            cssClass: 'col-sm-6 col-md-6 text-center app-icon',
            events: {
                tap: function() {
                    this.gotoPage('draw');
                }
            }
        }, {
            image: M.ImageView.extend({
                value: 'images/icons/front.png'
            }),
            legend: M.TextView.extend({
                value: 'Face Avant'
            })
        }),
        back: M.View.extend({
            grid: 'col-xs-6',
            cssClass: 'col-sm-6 col-md-6 text-center app-icon',
            events: {
                tap: function() {
                    this.gotoPage('drawLive');
                }
            }
        }, {
            image: M.ImageView.extend({
                value: 'images/icons/back.png'
            }),
            legend: M.TextView.extend({
                value: 'Face Arrière'
            })
        }),
    });

})();
