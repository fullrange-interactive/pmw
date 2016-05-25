
(function(global) {
    'use strict';

    // PLEASE DON'T CHANGE OR REMOVE THE COMMENTS.
    // All comments in this file are necessary for the build process.

    global.pmw = global.pmw || {};

    global.pmw.mconfig = {
        name: 'pmw',
        //debugView: NO,
        serverUrl: "http://192.168.1.101:443",
        liveDrawingUrl: "ws://bill.pimp-my-wall.ch:8080",
        liveDrawingPreviewImage: "701.png",
        defaultWindowGroup: "571a1ea1f8438dc48fec9592",
        webappUrl: "http://pmwapp.ch",
        selectedWindowData: null,
        routes: {
            '':                 'chooseLocationController',
            'gif':              'gifController',
            'draw':             'drawController',
            'drawPhoto':        'drawPhotoController',
            'drawLive':         'drawLiveController',
            'artist':           'drawLiveArtistController',
            'chooseFeature':    'chooseFeatureController',
            'chooseWindow':     'chooseWindowController'
        }
    };

})(this);