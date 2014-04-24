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
    });
})(this);