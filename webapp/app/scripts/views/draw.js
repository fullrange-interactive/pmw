/*global pmw*/

pmw.Views = pmw.Views || {};

(function () {
    'use strict';

    pmw.Views.DrawView = M.View.extend({

    }, {
        // The childViews as object
        area: M.View.extend({
            useElement: YES,
            template: '<div id="contentCanvas"><p style="text-align:center">Loading Canvas...</p></div>'
        }),

        tools: M.View.extend({
            grid: 'row',
            cssClass: 'tools toolbarview'
        }, {
            foregroundColor: M.TextfieldView.extend({
                grid: 'col-xs-2',
                value: '',
                cssClass: 'colorpicker foreground',
                type: 'text'
            }),
            backgroundColor: M.TextfieldView.extend({
                grid: 'col-xs-2',
                value: '',
                cssClass: 'colorpicker background',
                type: 'text'
            }),
            sizeStroke: M.SelectView.extend({
                grid: 'col-xs-2',
                scopeKey: 'selectionSize.size',
                cssClass: 'selectionSize',
                selectOptions: {
                    collection: [
                        {id: 1, name: 'small', value: 3},
                        {id: 2, name: 'medium', value: 5},
                        {id: 3, name: 'large', value: 7}
                    ],
                    labelPath: 'name',
                    valuePath: 'value',
                },
                events: {
                    change: 'changeSize'
                }
            }),
            undo: M.ButtonView.extend({
                grid: 'col-xs-2 col-sm-2 col-md-2',
                icon: 'fa-undo',
                value: '',
                events: {
                    tap: 'undo'
                }
            }),
            trash: M.ButtonView.extend({
                grid: 'col-xs-2 col-sm-2 col-md-2',
                cssClass: 'm-error',
                icon: 'fa-trash-o',
                value: '',
                events: {
                    tap: 'clearDraw'
                }
            }),
            save: M.ButtonView.extend({
                grid: 'col-xs-2 col-sm-2 col-md-2',
                cssClass: 'm-success',
                icon: 'fa-check',
                value: '',
                events: {
                    tap: 'saveDraw'
                }
            }),
        })
    });

})();