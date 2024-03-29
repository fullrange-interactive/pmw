
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
        liveDrawingPreviewId: "701",
        // defaultWindowGroup: "5784b59b8c9542025398f54d",
        defaultWindowGroup: "571a1ea1f8438dc48fec9592",
        webappUrl: "http://pmwapp.ch/webapp/",
        winHeight: 400,
        winWidth: 490,
        routes: {
            '':             'chooseFeatureController',
            'drawPhoto':    'drawphotoController',
            'vjing':        'vjingController',
            'draw':         'drawController',
            // 'drawLive':     'drawLiveController',
            'chooseFace':   'chooseFaceController',
            'poll':         'pollController',
            'clearAll':     'pollController'
        }
    };

})(this);