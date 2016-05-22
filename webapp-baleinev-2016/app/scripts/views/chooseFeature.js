/*global pmw*/

pmw.Views = pmw.Views || {};

(function() {
    'use strict';

    pmw.Views.ChooseFeatureView = M.View.extend({
        grid: 'row',
        cssClass: 'choose-feature'
    }, {
        artTower: M.View.extend({
            grid: 'col-xs-6',
            grid: 'col-xs-6',
            cssClass: 'col-sm-4 col-md-3 text-center app-icon',
            events: {
                tap: function() {
                    this.gotoPage('drawLive');
                }
            }
        }, {
            image: M.ImageView.extend({
                value: 'images/icons/art-tower.png'
            }),
            legend: M.TextView.extend({
                value: 'Art Tower'
            })
        }),
        /*
        gif: M.View.extend({
            grid: 'col-xs-6',
            cssClass: 'col-sm-4 col-md-3 text-center app-icon',
            events: {
                tap: function() {
                    this.gotoPage('vjing');
                }
            }
        }, {
            image: M.ImageView.extend({
                value: 'images/icons/gif.png'
            }),
            legend: M.TextView.extend({
                value: 'Gif Corner'
            })
        }),
        poll: M.View.extend({
            grid: 'col-xs-6',
            cssClass: 'col-sm-4 col-md-3 text-center app-icon',
            events: {
                tap: function() {
                    this.gotoPage('poll');
                }
            }
        }, {
            image: M.ImageView.extend({
                value: 'images/icons/poll.png'
            }),
            legend: M.TextView.extend({
                value: 'Voter'
            })
        }),
        */
    });

})();
