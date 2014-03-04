/*global $, M*/

(function(global) {
    'use strict';

    global.pmw = M.Application.extend().create(global.pmw.mconfig);

    $(document).ready(function() {

        global.pmw.start({
            routing: {
                routes: {
                    '': 'menuController',
                    'draw': 'drawController',
                    //m:routes
                },
                menuController: global.pmw.Controllers.MenuController.create(),
                drawController: global.pmw.Controllers.DrawController.create(),
                //m:controllers
            }
        });

        var myRequestManager = M.RequestManager.init({
            baseUrl: 'http://jebediah.pimp-my-wall.ch/',
            method: 'POST',
            timeout: 5000,
            callbacks: {
                beforeSend: {
                    action: function( obj ) {
                        obj.xhr.setRequestHeader("Accept", "application/json");
                        obj.xhr.setRequestHeader("Cache-Control", "no-cache");
                    }
                },
                error: {
                    action: function( obj ) {
                        // handle error globally
                        // (such as network error, timeout, parse error, ...)
                    }
                }
            }
        });
 
    });
})(this);