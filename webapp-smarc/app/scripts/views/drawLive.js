/*global pmw*/

pmw.Views = pmw.Views || {};

(function () {
    'use strict';

    pmw.Views.DrawLiveView = M.View.extend({
        cssClass: 'page-draw',
        template: '<div id="fb-root"></div>'
    }, {        
        tools: M.View.extend({
            grid: 'row',
            cssClass: 'tools toolbarview'
        }, {
            foregroundColor: M.TextfieldView.extend({
                grid: 'col-xs-4',
                value: '',
                cssClass: 'colorpicker foreground',
                type: 'text'
            }),
            // backgroundColor: M.TextfieldView.extend({
            //     grid: 'col-xs-2',
            //     value: '',
            //     cssClass: 'colorpicker background',
            //     type: 'text'
            // }),
            sizeStroke: M.SelectView.extend({
                grid: 'col-xs-4',
                scopeKey: 'selectionSize.size',
                cssClass: 'selectionSize',
                selectOptions: {
                    collection: [
                        {id: 1, name: 'small', value: 3},
                        {id: 2, name: 'medium', value: 10},
                        {id: 3, name: 'large', value: 20},
                        {id: 4, name: 'xlarge', value: 30}
                    ],
                    labelPath: 'name',
                    valuePath: 'value',
                },
                events: {
                    change: 'changeSize'
                }
            }),
            refreshPreview: M.ButtonView.extend({
                grid: 'col-xs-4',
				id:"send",
                cssClass: "m-success refreshPreview",
                value: '<i class="fa fa-refresh" />',
                events: {
                    tap: 'refreshPreview'
                }
            })
        }),
        // The childViews as object
        area: M.View.extend({
            useElement: YES,
            template: '<div id="contentCanvas"><p style="text-align:center">Loading Canvas...</p></div>'
        }),
    });

})();