(function(global) {
    'use strict';

    // PLEASE DON'T CHANGE OR REMOVE THE COMMENTS.
    // All comments in this file are necessary for the build process.

    global.pmw = global.pmw || {};

    global.pmw.mconfig = {
        name: 'pmw',
        //debugView: NO,
        serverUrl: "http://10.0.0.100",
        liveDrawingUrl: "ws://192.168.2.254:8080",
        liveDrawingPreviewImage: "50.png",
        defaultWindowGroup: "573d8b7157780e646cce8254",
        drawingWindowGroup: "55565adc8a8dbbeb37f4b1f0",
        webappUrl: "http://10.0.0.100:80/webapp-dedicace",
        winWidth: 930,
        winHeight: 759,
        selectedWindowData: null,
        routes: {
            '':                 'galleryController',
            'dedicacePhoto':    'drawPhotoController',
            'photographer':     'galleryPhotographerController', 
        }
    };

})(this);