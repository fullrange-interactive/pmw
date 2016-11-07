
(function(global) {
    'use strict';

    // PLEASE DON'T CHANGE OR REMOVE THE COMMENTS.
    // All comments in this file are necessary for the build process.

    global.pmw = global.pmw || {};

    global.pmw.mconfig = {
        name: 'pmw',
        //debugView: NO,
        serverUrl: "http://192.168.1.103:443",
        liveDrawingUrl: "ws://192.168.1.103:8080",
        liveDrawingPreviewImage: "50.png",
        defaultWindowGroup: "573d8b7157780e646cce8254",
        drawingWindowGroup: "55565adc8a8dbbeb37f4b1f0",
        webappUrl: "http://pmwapp.ch",
        winWidth: 1221,
        winHeight: 264,
        selectedWindowData: null,
        routes: {
            '':             'drawController'
        }
    };

})(this);