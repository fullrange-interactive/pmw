/*global pmw*/

pmw.Views = pmw.Views || {};

(function() {
    'use strict';

    pmw.Views.GalleryView = M.View.extend({
        cssClass: 'page-gif',
        template: '<div id="fb-root"></div>'
    }, {

        // The childViews as object
        area: M.View.extend({
            useElement: YES,
            template: '<div class="img-gallery" id="img-gallery"></div>'
        }),
        
    });

})();
