/*global pmw*/

pmw.Views = pmw.Views || {};

(function() {
    'use strict';

    pmw.Views.ChooseWindowView = M.View.extend({
        grid: 'row',
        cssClass: 'choose-window'
    }, {
        isometricTower: M.View.extend({
            cssClass: 'isometric-tower',
        }, {
            towerImage: M.ImageView.extend({
                cssClass: 'tower-image',
                value: 'images/isometric-tower.png'
            }),
            selectedWindow: M.ImageView.extend({
                cssClass: 'selected-window',
                value: 'images/selected-window-left.png'
            })
        }),
        buttons: M.View.extend({
            cssClass: 'buttons'
        }, {
            previous: M.ButtonView.extend({
                icon: "icon-angle-left",
                cssClass: "previous-window",
                value: "",
                events: {
                    tap: 'previousWindow'
                }
            }),
            ok: M.ButtonView.extend({
                icon: "icon-ok",
                cssClass: "ok m-success",
                value: "",
                events: {
                    tap: 'validateWindow'
                }
            }),
            // random: M.ButtonView.extend({
            //     icon: "icon-dice",
            //     cssClass: "random",
            //     value: "",
            //     events: {
            //         tap: 'randomWindow'
            //     }
            // }),
            next: M.ButtonView.extend({
                icon: "icon-angle-right",
                cssClass: "next-window",
                value: "",
                events: {
                    tap: 'nextWindow'
                }
            }),
        }),
        reservedMessage: M.View.extend({
            useElement: YES,
            template: '<div class="reserved-message modal-window shown"><div class="message-content"><h1>La tour est réservée!</h1><p>En ce moment, c\'est "<span class="artist-name">N.</span>", notre artiste invité d\'honneur, qui est en train d\'utiliser Art Tower.</p><p>Tu ne peux donc pas dessiner pour l\'instant.</p><p>Admire le spectacle et reviens dans 15 minutes!</p></div></div>'
        })
    });

})();
