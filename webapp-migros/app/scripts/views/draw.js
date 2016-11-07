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
            pause: M.ButtonView.extend({
                grid: 'col-xs-2 col-sm-1',
                icon: 'icon-pause-circle',
                value: '',
                events: {
                    tap: 'pause'
                },
                isEnabled: false
            }),
            record: M.ButtonView.extend({
                grid: 'col-xs-2 col-sm-1',
                icon: 'icon-circle',
                cssClass: 'record-button',
                value: '',
                events: {
                    tap: 'record'
                }
            }),
            timer: M.TextView.extend({
                grid: 'col-xs-8 col-sm-2',
                value: '<div class="value">00:00:00</div>',
                cssClass: 'timer',
                icon: 'icon-stopwatch'
            }),
            zoomIn: M.ButtonView.extend({
                grid: 'col-xs-2 col-sm-1',
                icon: 'icon-zoom-in',
                value: '',
                events: {
                    tap: 'zoomIn'
                }
            }),
            zoomOut: M.ButtonView.extend({
                grid: 'col-xs-2 col-sm-1',
                icon: 'icon-zoom-out',
                value: '',
                events: {
                    tap: 'zoomOut'
                }
            }),
            foregroundColor: M.TextfieldView.extend({
                grid: 'col-xs-2 col-sm-1',
                value: '',
                cssClass: 'colorpicker foreground',
                type: 'text'
            }),
            backgroundColor: M.TextfieldView.extend({
                grid: 'col-xs-2 col-sm-1',
                value: '',
                cssClass: 'colorpicker background',
                type: 'text'
            }),
            sizeStroke: M.SelectView.extend({
                grid: 'col-xs-2 col-sm-1',
                scopeKey: 'selectionSize.size',
                cssClass: 'selectionSize',
                selectOptions: {
                    collection: [
                        { id: 1, name: 'small', value: 1 },
                        { id: 2, name: 'small', value: 2 },
                        { id: 5, name: 'medium', value: 5 },
                        { id: 10, name: 'medium', value: 10 },
                        { id: 20, name: 'large', value: 20 },
                        { id: 30, name: 'xlarge', value: 30 },
                        { id: 60, name: 'xlarge', value: 60 }
                    ],
                    labelPath: 'name',
                    valuePath: 'value',
                },
                events: {
                    change: 'changeSize'
                }
            }),
            undo: M.ButtonView.extend({
                grid: 'col-xs-2 col-sm-1',
                icon: 'icon-ccw',
                value: '',
                events: {
                    tap: 'undo'
                }
            }),
            trash: M.ButtonView.extend({
                grid: 'col-xs-2 col-sm-1',
                cssClass: 'm-error',
                icon: 'icon-trash',
                value: '',
                events: {
                    tap: 'clearDrawPress'
                }
            }),
            save: M.ButtonView.extend({
                grid: 'col-xs-2 col-sm-1 col',
                cssClass: 'm-success',
                icon: 'icon-ok',
                value: '',
                events: {
                    tap: 'saveDraw'
                }
            }),
        }),
        panControls: M.View.extend({
            cssClass: 'pan-controls'
        }, {
            moveLeft: M.ButtonView.extend({
                grid: 'col-xs-3 col-sm-1',
                icon: 'icon-left-dir',
                cssClass: 'move-left',
                value: '',
                events: {
                    tap: 'moveLeft'
                }
            }),
            moveRight: M.ButtonView.extend({
                grid: 'col-xs-3 col-sm-1',
                icon: 'icon-right-dir',
                cssClass: 'move-right',
                value: '',
                events: {
                    tap: 'moveRight'
                }
            }),
            moveUp: M.ButtonView.extend({
                grid: 'col-xs-3 col-sm-1',
                icon: 'icon-up-dir',
                cssClass: 'move-up',
                value: '',
                events: {
                    tap: 'moveUp'
                }
            }),
            moveDown: M.ButtonView.extend({
                grid: 'col-xs-3 col-sm-1',
                icon: 'icon-down-dir',
                cssClass: 'move-down',
                value: '',
                events: {
                    tap: 'moveDown'
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
