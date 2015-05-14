/*global pmw*/

pmw.Views = pmw.Views || {};

(function () {
    'use strict';

    pmw.Views.VJingView = M.View.extend({
        cssClass: 'page-vjing',
        template: '<div id="fb-root"></div>'
    }, {
        // The childViews as object
        area: M.View.extend({
            useElement: YES,
            template: '<div class="swipeshow vjing-gallery" id="vjing-gallery"><ul class="slides"></ul><div id="vjing-help"></div></div>'
        }),
        tools: M.View.extend({
            grid: 'row',
            cssClass: 'tools toolbarview'
        }, {
            send: M.ButtonView.extend({
                grid: 'col-xs-2 col-sm-2 col-md-2',
				id:"send",
                cssClass: 'm-success pull-right',
                icon: 'fa-check',
                value: '',
                events: {
                    tap: 'sendClip'
                }
            }),
        })
    });

})();