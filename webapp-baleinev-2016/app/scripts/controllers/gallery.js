/*global pmw, $*/pmw.Controllers = pmw.Controllers || {};(function(global) {    'use strict';    var galImages = [];    var showNotifNewPicture = false;    global.pmw.intervalHandleGallery = null;        pmw.Controllers.GalleryController = pmw.Controllers.AbstractController.extend({        pageHeadline: "Clique sur l'image à dédicacer!",        _initViews: function() {            backRoute = "#chooseFeature";            // Create the ContentView with the controller (this) as scope            if (!this.contentView) {                this.contentView = pmw.Views.GalleryView.create(this, null, true);            }            // Create the HeaderView with the controller (this) as scope            if (!this.headerView) {                this.headerView = pmw.Views.BackheaderView.create(this, null, true);            }            this._applyViews();            galImages = [];            if(global.pmw.intervalHandleGallery === null)                global.pmw.intervalHandleGallery =  window.setInterval(function(){                    $.get(global.pmw.options.serverUrl + "/gallery/", {                            listImages: 1                        }, function(data) {                            this.fillGallery(data);                    }.bind(this), 'json');                }.bind(this),2000);            window.addEventListener('resize', this.resizeCanvas, false);            window.addEventListener('orientationchange', this.resizeCanvas, false);            $('.content-wrapper').scroll(this.scrollCheck);            this.resizeCanvas();            var current = this;        },        scrollCheck:function()        {            console.log($('.content-wrapper').scrollTop());            if(showNotifNewPicture && $('.content-wrapper').scrollTop() == 0)            {                $("#show-notif").remove();                showNotifNewPicture = false;            }        },        /* Prepend new images to img-gallery */        fillGallery: function(images) {            for (var i = 0; i < images.length; i++)            {                if(galImages.indexOf(images[i]) == -1)                {                    var img = $(new Image());                                        img.on('load',function()                    {                        galImages.push(this.attr("data-path"));                        this.attr('width',"100%");                        var markup = $('<div class="img"></div>');                        markup.append(this);                        $("#img-gallery").prepend(markup);                        if($('.content-wrapper').scrollTop()!=0)                        {                            $('.content-wrapper').scrollTop($('.content-wrapper').scrollTop() + this[0].clientHeight);                            if(!showNotifNewPicture)                            {                                $('.content-wrapper').append('<div id="show-notif"><p>Des nouvelles images sont disponibles. Clique ici pour remonter !</p></div>');                                $('#show-notif').on('tap click',function(){                                    $('.content-wrapper').scrollTop(0);                                });                                showNotifNewPicture = true;                            }                        }                    }.bind(img));                    img.on("tap click", function(e) {                        e.preventDefault();                        global.pmw.selectedGalImage = this.attr("src");                        // console.log(this.attr("data-basename"));                        pmw.navigate({                            route: '/dedicacePhoto'                        });                    }.bind(img));                    img.attr('data-path',images[i]);                    img.attr('src',global.pmw.options.serverUrl + images[i]);                }            }        },        resizeCanvas: function() {        }    });})(this);