
(function(global) {
    'use strict';

    // PLEASE DON'T CHANGE OR REMOVE THE COMMENTS.
    // All comments in this file are necessary for the build process.

    global.pmw = global.pmw || {};

    global.pmw.mconfig = {
        name: 'pmw',
        //debugView: NO,
		serverUrl: "http://bill.pimp-my-wall.ch",
        routes: {
            //'': 'drawLiveController',
            '': 'choosePhotoController',
            //'': 'drawphotoController',
            // 'vjing': 'vjingController',
            // 'chooseFeature': 'chooseFeatureController'
        }
    };

})(this);