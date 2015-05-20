/*global pmw*/

pmw.Views = pmw.Views || {};

(function () {
    'use strict';

    pmw.Views.VJingView = M.View.extend({
        cssClass: 'page-vjing',
        template: '<div id="fb-root"></div>'
    }, {
        tools: M.View.extend({
            grid: 'row',
            cssClass: 'tools toolbarview'
        }, {
            send: M.ButtonView.extend({
                grid: 'col-xs-12 col-sm-12 col-md-12',
				id:"send",
                cssClass: 'm-success pull-right',
                value: '<i class="fa fa-rocket" /> Envoyer',
                events: {
                    tap: 'sendClip'
                }
            }),
        }),
        // The childViews as object
        area: M.View.extend({
            useElement: YES,
            template: '<div class="swipeshow vjing-gallery" id="vjing-gallery"></div><div id="vjing-flash"></div><button class="next" id="slide-next"><i class="fa fa-chevron-right"></i></button><button class="previous" id="slide-previous"><i class="fa fa-chevron-left"></i></button><div id="vjing-help"></div>'
        })
    });

})();