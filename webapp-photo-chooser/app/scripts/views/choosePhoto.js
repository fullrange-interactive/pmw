/*global pmw*/

pmw.Views = pmw.Views || {};

(function () {
    'use strict';

    pmw.Views.ChoosePhotoView = M.View.extend({
        cssClass: 'page-choose-photo',
        template: '<div id="fb-root"></div>'
    }, {
        // The childViews as object
        area: M.View.extend({
            useElement: YES,
            template: '<div class="photo-gallery" id="photo-gallery"></div><button class="next" id="slide-next"><i class="fa fa-chevron-right"></i></button><button class="previous" id="slide-previous"><i class="fa fa-chevron-left"></i></button>'
        }),
        logo: M.ImageView.extend({
            cssClass: 'header-logo',
            value: 'images/logo-mybcvs.png'
        }),
        modalContainer: M.View.extend({
            cssClass: 'modal-alert-container'
        }, {
            modalWindow: M.View.extend({
                cssClass: 'modal-alert-window'
            }, {
                text: M.View.extend({
                    cssClass: 'modal-alert-text'
                }),
                okButton: M.ButtonView.extend({
                    value: 'OK',
                    cssClass: 'ok-button',
                    events: {
                        tap: "closeModalAlert"
                    }
                })
            })
        }), 
    });

})();