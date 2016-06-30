
(function(global) {
    'use strict';

    // PLEASE DON'T CHANGE OR REMOVE THE COMMENTS.
    // All comments in this file are necessary for the build process.

    global.pmw = global.pmw || {};

    global.pmw.mconfig = {
        name: 'pmw',
        //debugView: NO,
        serverUrl: "http://bill.pimp-my-wall.ch",
        liveDrawingUrl: "ws://bill.pimp-my-wall.ch:8080",
        liveDrawingPreviewImage: "50.png",
        defaultWindowGroup: "573d8b7157780e646cce8254",
        drawingWindowGroup: "55565adc8a8dbbeb37f4b1f0",
        webappUrl: "http://pmwapp.ch",
        winWidth: 930,
        winHeight: 759,
        selectedWindowData: null,
        routes: {
            '':                 'chooseLocationController',
            'gif':              'gifController',
            'gallery':          'galleryController',
            'draw':             'drawController',
            'drawPhoto':        'drawPhotoController',
            'dedicacePhoto':    'drawPhotoController',            
            'drawLive':         'drawLiveController',
            'artist':           'drawLiveArtistController',
            'chooseFeature':    'chooseFeatureController',
            'chooseWindow':     'chooseWindowController'
        }
    };

})(this);