/*global pmw*/

pmw.Views = pmw.Views || {};

(function() {
    'use strict';

    pmw.Views.DrawView = M.View.extend({
        cssClass: 'page-draw',
        template: '<div id="fb-root"></div>'
    }, {
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
                        { id: 1, name: 'small', value: 3 },
                        { id: 2, name: 'medium', value: 10 },
                        { id: 3, name: 'large', value: 20 },
                        { id: 4, name: 'xlarge', value: 30 }
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
                icon: 'icon-ccw',
                value: '',
                events: {
                    tap: 'undo'
                }
            }),
            trash: M.ButtonView.extend({
                grid: 'col-xs-2 col-sm-2 col-md-2',
                cssClass: 'm-error',
                icon: 'icon-trash',
                value: '',
                events: {
                    tap: 'clearDraw'
                }
            }),
            save: M.ButtonView.extend({
                grid: 'col-xs-2 col-sm-2 col-md-2',
                cssClass: 'm-success',
                icon: 'icon-ok',
                value: '',
                events: {
                    tap: 'saveDraw'
                }
            }),
        }),
        // The childViews as object
        area: M.View.extend({
            useElement: YES,
            template: '<div id="messageBox"></div><div title="Social" style="display:none" id="messageBoxSocial"><p>Partager votre dessin sur :</p><p><button id="facebook" type="button" class="btn btn-primary">Facebook</button></p></div><div id="contentCanvas"><p style="text-align:center">Loading Canvas...</p></div>'
        }),
    });

})();
