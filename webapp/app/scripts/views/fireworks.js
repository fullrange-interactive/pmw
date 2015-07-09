/*global pmw*/

pmw.Views = pmw.Views || {};

(function () {
    'use strict';
    
    pmw.Views.FireworksView = M.View.extend({
        cssClass: 'page-fireworks',
        template: '<div id="fb-root"></div>'
    }, {
        area: M.View.extend({
            id: 'fireworks-gallery',
            useElement: YES,
            template: '<div class="swipeshow fireworks-gallery" id="fireworks-gallery"></div>'
        }),
        colors: M.View.extend({
            id: 'fireworksColors',
            grid: 'row',
            cssClass: 'tools'
        }, {
            primaryColor: M.TextfieldView.extend({
                id: 'primaryColor',
                grid: 'col-xs-6',
                value: '',
                cssClass: 'colorpicker primarycolor',
                type: 'text'
            }),
            secondaryColor: M.TextfieldView.extend({
                id: 'secondaryColor',
                grid: 'col-xs-6',
                value: '',
                cssClass: 'colorpicker secondarycolor',
                type: 'text'
            }),
        }),
        orientation: M.View.extend({
            grid: 'row'
        },{})
    });

})();