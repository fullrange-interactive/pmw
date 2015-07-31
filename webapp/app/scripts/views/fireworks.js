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
        arrows: M.View.extend({
            value: '<button class="next" id="slide-next"><i class="fa fa-chevron-right"></i></button><button class="previous" id="slide-previous"><i class="fa fa-chevron-left"></i></button>'
        }),
        colors: M.View.extend({
            id: 'fireworksColors',
            grid: 'row',
            cssClass: 'tools'
        }, {
            primaryColor: M.TextfieldView.extend({
                id: 'primaryColor',
                grid: 'col-xs-3 col-xs-offset-1',
                value: '',
                cssClass: 'colorpicker primarycolor',
                type: 'text'
            }),
            secondaryColor: M.TextfieldView.extend({
                id: 'secondaryColor',
                grid: 'col-xs-3 col-xs-offset-4',
                value: '',
                cssClass: 'colorpicker secondarycolor',
                type: 'text'
            }),
            legendPrimaryColor: M.TextView.extend({
                value: 'Couleur 1',
                grid: 'col-xs-3 col-xs-offset-1',
                cssClass: 'legend'
            }),
            legendSecondaryColor: M.TextView.extend({
                value: 'Couleur 2',
                grid: 'col-xs-3 col-xs-offset-4',
                cssClass: 'legend'
            })
        }),
        orientation: M.View.extend({
            grid: 'row'
        },{}),
        orient: M.ImageView.extend({
            cssClass: 'orient-arrow',
    		value : 'images/orientation.png',
        }),
        send: M.ButtonView.extend({
            grid: 'col-xs-6 col-xs-offset-3',
            id:'send',
            cssClass: 'm-success',
            value: '<i class="fa fa-rocket">  <span class="btn-text">Lancer!</span>',
            events: {
                tap: 'sendFirework'
            }
        })
    });

})();

/*        tools: M.View.extend({
            grid: 'row',
            cssClass: 'tools toolbarview'
        }, {
            send: M.ButtonView.extend({
                grid: 'col-xs-12 col-sm-12 col-md-12',
				id:"send",
                cssClass: 'm-success pull-right',
                value: '<i class="fa fa-rocket" /> <span class="btn-text">Envoyer</span>',
                events: {
                    tap: 'sendClip'
                }
            }),
        }),
*/