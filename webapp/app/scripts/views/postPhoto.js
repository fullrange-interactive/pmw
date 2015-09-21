pmw.Views = pmw.Views || {},
function() {
    "use strict";
    pmw.Views.PostPhotoView = M.View.extend({
        cssClass: "page-post-photo",
        template: '<div id="fb-root"></div>'
    }, {
        help: M.View.extend({
            cssClass: "post-photo-help"
        }, {
            conditionsButton: M.ButtonView.extend({
                icon: 'fa-question-circle',
                cssClass: 'conditions mini',
                value: 'Conditions de participation',
                events:{
                    tap: 'showConditions'
                }
            }),
        }),
        area: M.View.extend({
            cssClass: "post-photo-canvas-wrapper",
        }, {
            canvas: M.View.extend({
                useElement: YES,
                template: '<canvas id="post-photo-canvas"></canvas>'
            }),
            sendButton: M.ButtonView.extend({
                icon: 'fa-rocket',
                value: 'Envoyer!',
                cssClass: 'send'
            })
        }),
        takePhoto: M.ButtonView.extend({
            icon: 'fa-camera',
            cssClass: 'camera',
        }),
        conditionsText: M.View.extend({
            cssClass: 'conditionsText'
        }, {
            conditionsCloseButton: M.ButtonView.extend({
                icon: 'fa-check-circle',
                value: 'OK',
                events: {
                    tap: 'closeConditions'
                }
            }),
            conditionsIFrame: M.View.extend({
                useElement: YES,
                template: '<div class="iframe-holder"><iframe src="http://pimp-my-wall.ch/privacy.html"></iframe></div>'
            })
        })
    })
}()