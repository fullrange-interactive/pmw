/*global pmw*/

pmw.Controllers = pmw.Controllers || {};

(function(global) {
    'use strict';

    pmw.Controllers.MenuController = pmw.Controllers.AbstractController.extend({

        tmpViews: null,

        /*registerMenuItem: function( menuEntry ){
            this._initMenu();
            console.log(menuEntry);
            this.tmpViews.add(menuEntry);
        },*/

        _initViews: function() {

            //Init the collection
            //this._initMenu();

            // Create the menuView with the controller (this) as scope
            if (!this.contentView) {
                this.contentView = pmw.Views.HomeView.create(this, null, true);
            }

            // Create the HeaderView with the controller (this) as scope
            if (!this.headerView) {
                this.headerView = M.ToolbarView.extend({
                    grid: 'col-md-12',
                    value: 'Pimp My Wall'
                }).create();
            }

            this._applyViews();
        },

        /*_initMenu: function(){
            if( !this.tmpViews ) {
                this.tmpViews = pmw.Collections.TmpviewsCollection.create([]);
            }
        },*/

        setLocationAndChooseFeature: function(location) {
            global.pmw.selectedWindowGroup = location;
            localStorage.setItem("selectedWindowGroup", location);
            pmw.navigate({
                route: '/chooseFeature'
            });

        }
    });

})(this);
