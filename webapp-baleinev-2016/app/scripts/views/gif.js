/*global pmw*/

pmw.Views = pmw.Views || {};

(function() {
    'use strict';

    pmw.Views.GifView = M.View.extend({
        cssClass: 'page-gif',
        template: '<div id="fb-root"></div>'
    }, {
        tools: M.View.extend({
            grid: 'row',
            cssClass: 'tools toolbarview'
        }, {
            send: M.ButtonView.extend({
                grid: 'col-xs-12 col-sm-12 col-md-12',
                id: "send",
                cssClass: 'm-success pull-right',
                value: '<i class="icon-rocket" /> <span class="btn-text">Envoyer</span>',
                events: {
                    tap: 'sendClip'
                }
            }),
        }),
        // The childViews as object
        area: M.View.extend({
            useElement: YES,
            template: '<div class="swipeshow gif-gallery" id="gif-gallery"></div><div id="gif-flash"></div><button class="next" id="slide-next"><i class="icon-angle-right"></i></button><button class="previous" id="slide-previous"><i class="icon-angle-left"></i></button><div id="gif-help"></div>'
        })
    });

})();
