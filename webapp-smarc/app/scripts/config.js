
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
        liveDrawingPreviewId: "307",
        webappUrl: "http://pimp-my-wall.ch/webapp/",
        routes: {
            '':             'chooseFeatureController',
            'drawPhoto':    'drawphotoController',
            'vjing':        'vjingController',
            'draw':         'drawController',
            'drawLive':     'drawLiveController'
        },
        contestServerPostUrl: "http://bob.pimp-my-wall.ch/post.php",
        contestServerStatusUrl: "http://bob.pimp-my-wall.ch/status.php"
    };

})(this);