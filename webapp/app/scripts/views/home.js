/*global pmw*/

pmw.Views = pmw.Views || {};

(function () {
    'use strict';

    pmw.Views.HomeView = M.View.extend({
        grid: 'row'
    }, {
        menu: M.View.extend({
            grid: 'col-md-12',
        },{
            draw: M.ImageView.extend({
                value: 'images/drawing.jpg',
                events: {
                        tap: function(){
                            this.gotoPage('draw');
                        }
                }
            })
        })
    });

})();