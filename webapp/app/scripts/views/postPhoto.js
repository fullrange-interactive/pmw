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
                cssClass: 'send',
                events: {
                    tap: 'sendPhoto'
                }
            })
        }),
        takePhoto: M.ButtonView.extend({
            icon: 'fa-camera',
            cssClass: 'camera',
        }),
        conditionsText: M.View.extend({
            cssClass: 'conditions-text modal-window'
        }, {
            conditionsCloseButton: M.ButtonView.extend({
                icon: 'fa-times',
                cssClass: 'close-modal-window alt-color',
                events: {
                    tap: 'closeConditions'
                }
            }),
            conditionsIFrame: M.View.extend({
                useElement: YES,
                template: '<div class="iframe-holder"><iframe src="html/privacy.html"></iframe></div>'
            })
        }),
        participateForm: M.View.extend({
            cssClass: 'participate-form modal-window'
        }, {
            close: M.ButtonView.extend({
                icon: 'fa-times',
                cssClass: 'close-modal-window alt-color',
                events: {
                    tap: 'closeParticipate'
                }
            }),
            helpGeneral: M.TextView.extend({
                value: "Veuillez remplir tous les champs. Ceci nous permettra de vous contacter si vous gagnez!",
                grid: 'col-xs-12',
                cssClass: 'general-description'
            }),
            firstName: M.TextfieldView.extend({
                label: 'Prénom:',
                grid: 'col-xs-12',
                id: "first-name",
                type: 'text',
                placeholder: 'John',
                regexp: /(.+)/,
                events: {
                    keyup: 'checkField'
                }
            }),            
            lastName: M.TextfieldView.extend({
                label: 'Nom:',
                grid: 'col-xs-12',
                id: "last-name",
                type: 'text',
                placeholder: 'Smith',
                regexp: /(.+)/,
                events: {
                    keyup: 'checkField'
                }
            }),
            phone: M.TextfieldView.extend({
                label: 'N° de téléphone:',
                grid: 'col-xs-12',
                id: "phone",
                placeholder: '079 123 4567',
                type: 'text',
                regexp: /[0-9\+\.\-\(\) ]{10,}/i,
                events: {
                    keyup: 'checkField'
                }
            }),
            email: M.TextfieldView.extend({
                label: 'Adresse e-mail:',
                grid: 'col-xs-12',
                id: "email",
                type: 'something',
                placeholder: 'john.smith@example.org',
                regexp: /.+@.+\..+/i,
                events: {
                    keyup: 'checkField'
                }
            }),
            helpSocial: M.TextView.extend({
                grid: 'col-xs-12',
                value: 'Choisissez un réseau social pour participer:'
            }),
            submitFacebook: M.ButtonView.extend({
                icon: 'fa-facebook',
                grid: 'col-xs-6',
                cssClass: 'post-social facebook',
                value: 'Facebook',
                events: {
                    tap: 'participateFacebook'
                }
            }),
            submitInstagram: M.ButtonView.extend({
                icon: 'fa-instagram',
                grid: 'col-xs-6',
                cssClass: 'post-social instagram',
                value: 'Instagram',
                events: {
                    tap: 'participateInstagram'
                }
            })
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
        shareInstagram: M.View.extend({
            cssClass: 'share-instagram modal-window'
        }, {
            close: M.ButtonView.extend({
                icon: 'fa-times',
                cssClass: 'close-modal-window alt-color',
                events: {
                    tap: 'closeInstagram'
                }
            }),
            photo: M.ImageView.extend({
                cssClass: 'user-photo-big',
                value: 'images/selfie-example.jpg'
            }),
            explanation: M.View.extend({
                useElement: YES,
                template: "<ol><li>Sauvegardez cette image</li><li>Ouvrez Instagram</li><li>Publiez votre selfie, <strong>n'oubliez pas le hashtag #mybcvs!</strong></li></ol>"
            }),
            screenshot: M.View.extend({
                cssClass: 'screenshot-container'
            }, {
                photo: M.ImageView.extend({
                    cssClass: 'user-photo',
                    value: 'images/selfie-example.jpg'
                }),
                overlay: M.ImageView.extend({
                    cssClass: 'overlay',
                    value: 'images/instagram-ios.png'
                })
            }),
            openInstagram: M.ButtonView.extend({
                icon: 'fa-instagram',
                cssClass: 'instagram open-instagram',
                value: 'Ouvrir Instagram',
                events:{
                    tap: 'openInstagramApp'
                }
            })
        })
    })
}()