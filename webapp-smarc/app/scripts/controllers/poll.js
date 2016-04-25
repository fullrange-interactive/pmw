/*global pmw, $*/

pmw.Controllers = pmw.Controllers || {};

(function(global) {
    'use strict';

    pmw.Controllers.PollController = pmw.Controllers.AbstractController.extend({

        pageHeadline: "Voter",
        polls: null,

        _initViews: function() {
            backRoute = "#";
            // Create the ContentView with the controller (this) as scope
            if (!this.contentView) {
                this.contentView = pmw.Views.PollView.create(this, null, true);
            }

            // Create the HeaderView with the controller (this) as scope
            if (!this.headerView) {
                this.headerView = pmw.Views.BackheaderView.create(this, null, true);
            }

            this._applyViews();

            $.get(global.pmw.options.serverUrl + "/poll", {
                listImages: 1
            }, function(data) {
                this.polls = data;
                
            }.bind(this), 'json');
        }
    });

})(this);
