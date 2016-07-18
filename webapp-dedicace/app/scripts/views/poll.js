/*global pmw*/

pmw.Views = pmw.Views || {};

(function() {
    'use strict';

    pmw.Views.PollView = M.View.extend({
        cssClass: 'page-poll',
        template: '<div id="fb-root"></div>'
    }, {
        // The childViews as object
        polls: M.View.extend({
            useElement: YES,
            template: '<div id="polls"></div>'
        })
    });

})();