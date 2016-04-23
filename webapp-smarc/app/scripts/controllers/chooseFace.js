/*global pmw, $*/

pmw.Controllers = pmw.Controllers || {};

(function (global) {
    'use strict';

    pmw.Controllers.ChooseFaceController = pmw.Controllers.AbstractController.extend({

        pageHeadline: "Quelle face?",

        _initViews: function() {
            backRoute = "/";
            // Create the ContentView with the controller (this) as scope
            if( !this.contentView ) {
                this.contentView = pmw.Views.ChooseFaceView.create(this, null, true);
            }

            // Create the HeaderView with the controller (this) as scope
            // Create the HeaderView with the controller (this) as scope
            if( !this.headerView ) {
                this.headerView = pmw.Views.BackheaderView.create(this, null, true);
            }

            this._applyViews();
            
            var that = this;
        },

        gotoPage: function( page ) {            

            pmw.navigate({
                route: '/' + page
            });

        }
    });

})(this);
