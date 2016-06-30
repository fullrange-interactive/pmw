pmw.Views = pmw.Views || {},
    function() {
        "use strict";
        pmw.Views.DrawPhotoView = M.View.extend({
            cssClass: "page-drawphoto",
            template: '<div id="fb-root"></div>'
        }, {

            tools: M.View.extend({
                grid: "row",
                cssClass: "tools toolbarview"
            }, {
                background: M.ButtonView.extend({
                    grid: "col-xs-2 col-sm-2 col-md-2",
                    icon: "icon-camera",
                    cssClass: "camera",
                    value: ""
                }),                
                foregroundColor: M.TextfieldView.extend({
                    grid: "col-xs-2",
                    value: "",
                    cssClass: "colorpicker foreground",
                    type: "text"
                }),
                sizeStroke: M.SelectView.extend({
                    grid: "col-xs-2",
                    scopeKey: "selectionSize.size",
                    cssClass: "selectionSize",
                    selectOptions: {
                        collection: [{
                            id: 1,
                            name: "small",
                            value: 3
                        }, {
                            id: 2,
                            name: "medium",
                            value: 10
                        }, {
                            id: 3,
                            name: "large",
                            value: 20
                        }, {
                            id: 4,
                            name: "xlarge",
                            value: 30
                        }],
                        labelPath: "name",
                        valuePath: "value"
                    },
                    events: {
                        change: "changeSize"
                    }
                }),
                undo: M.ButtonView.extend({
                    grid: "col-xs-2 col-sm-2 col-md-2",
                    icon: "icon-ccw",
                    value: "",
                    events: {
                        tap: "undo"
                    }
                }),
                trash: M.ButtonView.extend({
                    grid: "col-xs-2 col-sm-2 col-md-2",
                    cssClass: "m-error",
                    icon: "icon-trash",
                    value: "",
                    events: {
                        tap: "clearDraw"
                    }
                }),
                save: M.ButtonView.extend({
                    grid: "col-xs-2 col-sm-2 col-md-2",
                    cssClass: "m-success",
                    icon: "icon-ok",
                    value: "",
                    events: {
                        tap: "saveDraw"
                    }
                })
            }),
            scratchCanvas: M.View.extend({
                useElement: YES,
                template: '<canvas id="scratch-canvas"></canvas>'
            }),
            area: M.View.extend({
                useElement: YES,
                template: '<div class="contentCanvas drawPhotoCanvas drawPhotoCanvasEmpty"><p style="text-align:center">Loading Canvas...</p></div>'
            })
        })
    }()
