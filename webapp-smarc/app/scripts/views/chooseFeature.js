/*global pmw*/

pmw.Views = pmw.Views || {};

(function() {
    'use strict';

    pmw.Views.ChooseFeatureView = M.View.extend({
        grid: 'row',
        cssClass: 'choose-feature'
    }, {
        draw: M.View.extend({
            grid: 'col-xs-6',
            cssClass: 'col-sm-4 col-md-3 text-center app-icon',
            events: {
                tap: function() {
                    this.gotoPage('chooseFace');
                }
            }
        }, {
            image: M.ImageView.extend({
                value: 'images/icons/draw.png'
            }),
            legend: M.TextView.extend({
                value: 'Dessin'
            })
        }),
        drawPhoto: M.View.extend({
            grid: 'col-xs-6',
            cssClass: 'col-sm-4 col-md-3 text-center app-icon',
            events: {
                tap: function() {
                    this.gotoPage('drawPhoto');
                }
            }
        }, {
            image: M.ImageView.extend({
                value: 'images/icons/drawPhoto.png'
            }),
            legend: M.TextView.extend({
                value: 'Photo'
            })
        }),
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
                value: 'Animation'
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
    });

})();
