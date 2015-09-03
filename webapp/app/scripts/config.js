
(function(global) {
    'use strict';

    // PLEASE DON'T CHANGE OR REMOVE THE COMMENTS.
    // All comments in this file are necessary for the build process.

    global.pmw = global.pmw || {};

    global.pmw.mconfig = {
        name: 'pmw',
        locales: [
            {locale: 'en'},
            //m:i18n
        ],
        //debugView: NO,
		serverUrl: "http://bill.pimp-my-wall.ch",
        liveDrawingUrl: "ws://bill.pimp-my-wall.ch:8080",
        liveDrawingPreviewId: "301",
    };

})(this);