/*global pmw, $*/pmw.Controllers = pmw.Controllers || {};(function(global) {    'use strict';    pmw.Controllers.ChooseFeatureController = pmw.Controllers.AbstractController.extend({        pageHeadline: "Choisis un truc",        _initViews: function() {            backRoute = "/";            // Create the ContentView with the controller (this) as scope            if (!this.contentView) {                this.contentView = pmw.Views.ChooseFeatureView.create(this, null, true);            }            // Create the HeaderView with the controller (this) as scope            if (!this.headerView) {                this.headerView = pmw.Views.BackheaderView.create(this, null, true);            }            this._applyViews();            var that = this;        },        fillGallery: function() {            for (var i = 0; i < this.vjImages.length; i++) {                var slide = $("<li>");                slide.addClass("slide");                slide.html('<img src="' + global.pmw.options.serverUrl + this.vjImages[i] + '"/>')                $("#vjing-gallery").find(".slides").append(slide)            }        },        gotoPage: function(page) {            console.log(page);            pmw.navigate({                route: '/' + page            });        }    });})(this);