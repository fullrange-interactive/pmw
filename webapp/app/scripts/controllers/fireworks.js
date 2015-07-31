/*global pmw, $*/

pmw.Controllers = pmw.Controllers || {};

(function (global) {
    'use strict';

    var ROCKETS_AMOUNT = 3;

    var helpGone = false;
    var canSend = true;
    var waitTime = 5;
    var timeRemaining = 4;
    var rocketsRemaining = ROCKETS_AMOUNT;
    var pleaseWaitInterval = null;
    var angle = 0;
    var power = 50;

    pmw.Controllers.FireworksController = pmw.Controllers.AbstractController.extend({

        pageHeadline: "Pimp My Wall",
        
        primaryColor: "#e5287b",
        secondaryColor: "#fce94f",
        angle: 0,
        power: 50,
        palette:
                [
                    ['00ff00','ff0000','a855ff'],
                    ['07ace2','ff7300','57ffff'],
                    ['e5287b','fce94f','ffa357'],
                ],
        
        fireworks: {
            0: pmw.Collections.FireworksData["sphere-monochrome"],
            1: pmw.Collections.FireworksData["sphere-half"],
            2: pmw.Collections.FireworksData["sphere-mixed"],
            3: pmw.Collections.FireworksData["ring-monochrome"],
            4: pmw.Collections.FireworksData["double-sphere"],
            5: pmw.Collections.FireworksData["saturn"],
            6: pmw.Collections.FireworksData["palm-tree"],
            8: pmw.Collections.FireworksData["small-sphere-big-trails"],
            10:pmw.Collections.FireworksData["big-sphere-small-trails"],
            12:pmw.Collections.FireworksData["bombs-sphere"],
            13:pmw.Collections.FireworksData["bombs-trails"],
            15:pmw.Collections.FireworksData["flashes"],
            16:pmw.Collections.FireworksData["bees"],
            18:pmw.Collections.FireworksData["spiral"]
        },

        _initViews: function() {
            //backRoute = "#chooseFeature";
            // Create the ContentView with the controller (this) as scope
            if( !this.contentView ) {
                this.contentView = pmw.Views.FireworksView.create(this, null, true);
            }
            
            if ( Math.random() < 0.1 )
                this.fireworks[20] = pmw.Collections.FireworksData["nuclear"];

            // Create the HeaderView with the controller (this) as scope
            if( !this.headerView ) {
                this.headerView = M.ToolbarView.extend({
                    grid: 'col-md-12',
                    value: 'Pimp My Wall'
                }).create();
            }

            this._applyViews();
            
            var that = this;
            
            $(".colorpicker.primarycolor input").spectrum({
                showPaletteOnly: true,
                showPalette:true,
                color: that.primaryColor,
                palette: that.palette,
                change: function( color ) {
                    that.setPrimaryColor(color.toHexString());
                    localStorage.setItem('Background', color.toHexString());
                }
            });
            
            $(".colorpicker.secondarycolor input").spectrum({
                showPaletteOnly: true,
                showPalette:true,
                color: that.secondaryColor,
                palette: that.palette,
                change: function( color ) {
                    that.setSecondaryColor(color.toHexString());
                    localStorage.setItem('Background', color.toHexString());
                }
            });
            
			this.fillGallery(this.fireworks);
            
			$("#fireworks-gallery").slick({
                prevArrow:'#slide-previous',
                nextArrow:'#slide-next',
                slidesToShow: 1,
                centerMode: true,
                swipeToSlide: true,
                speed: 200,
                focusOnSelect: true
			});
            
            this.setPrimaryColor(this.primaryColor);
            this.setSecondaryColor(this.secondaryColor);
            var orientArrow =  $(".orient-arrow img");
            var containerArrow = $(".orient-arrow");
            var dragging = false;
            var oldTrans = "";
            
            jQuery.fn.rotate = function(degrees) {
                $(this).css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
                             '-moz-transform' : 'rotate('+ degrees +'deg)',
                             '-ms-transform' : 'rotate('+ degrees +'deg)',
                             'transform' : 'rotate('+ degrees +'deg)'});
                return $(this);
            };
            
            var calcRot = function (e){
                var oY = $(window).height() - 80;
                var oX = $(window).width() / 2;
                angle = 0;
                var mX, mY;
                if ( e.pageX ){
                    mX = e.pageX;
                    mY = e.pageY;
                }else if ( e.originalEvent.touches && e.originalEvent.touches.length > 0 ){
                    mX = e.originalEvent.touches[0].pageX;
                    mY = e.originalEvent.touches[0].pageY;
                }else {
                    mX = e.originalEvent.pageX;
                    mY = e.originalEvent.pageY;
                }
                angle =  90 + 180 / Math.PI * Math.atan2(mY - oY, mX - oX);
                
                console.log(angle * 180 / Math.PI);
                if ( angle < 15 && angle > -15){
                    orientArrow.rotate(angle);
                }
                var dist = Math.sqrt((mX - oX)*(mX - oX) + (mY - oY)*(mY - oY)) + 30;
                if ( dist > 250 )
                    dist = 250;
                if ( dist < 130 )
                    dist = 130;
                power = (dist-130)/(250-130)*100;
                var w = 140*(Math.exp(-dist/230)) + 30;
                orientArrow.css("height",dist + "px");
                orientArrow.css("margin-top", (-100 - (dist-200)) + "px");
                orientArrow.css("width",w + "px");
                orientArrow.css("margin-left", (-w/2) + "px");
                orientArrow.css("transform-origin", (w/2) + "px " + dist + "px");
            }
            
            $(".orient-arrow").on("touchstart mousedown", function(e){
                /*
                orientArrow.css("width","80px");
                orientArrow.css("height","230px");
                orientArrow.css("margin-left","-40px");
                orientArrow.css("margin-top", "-130px");
                orientArrow.css("transform-origin","50px 230px");
                oldTrans = orientArrow.css("transition");
                orientArrow.css("transition","none");
                orientArrow.css("-webkit-transition", "none");*/
                dragging = true;
                calcRot(e);
                e.preventDefault();
            });
            
            $(window).on("touchend mouseup", function(e){
                if( dragging ){
                    calcRot(e);
                    /*
                    orientArrow.css("transition",oldTrans);
                    orientArrow.css("-webkit-transition", oldTrans);
                    orientArrow.css("width","100px");
                    orientArrow.css("height","200px");
                    orientArrow.css("margin-left","-50px");
                    orientArrow.css("margin-top","-100px");
                    orientArrow.css("transform-origin","50px 200px")*/
                    dragging = false;
                    e.preventDefault();
                }
            });
            
            $(window).on("mousemove touchmove", function(e){
                if ( dragging ){
                    calcRot(e);
                }
            })
        },
        
        sendFirework: function (){
            if ( !canSend ){
                return;
            }
            //canSend = false;
            var current = this;
			var selectedFirework;
			$("#fireworks-gallery").find("div.image").each(function (){
				if ( $(this).hasClass("slick-active") ){
					selectedFirework = $(this).attr("data-fireworks-name");
				}
			})
            
            if ( selectedFirework == 6 )
                if ( Math.random() < 0.5 )
                    selectedFirework = 7;
            
            if ( selectedFirework == 8 )
                if ( Math.random() < 0.5 )
                    selectedFirework = 9;
            
            if ( selectedFirework == 10 )
                if ( Math.random() < 0.5 )
                    selectedFirework = 11;
            
            if ( selectedFirework == 13 )
                if ( Math.random() < 0.5 )
                    selectedFirework = 14;
            
            if ( selectedFirework == 20 ){
                $("#fireworks-gallery").slick('slickRemove',$("#fireworks-gallery").slick('slickCurrentSlide'));
                $("#fireworks-gallery").slick('slickGoTo',0);
            }
            
            $("body").css("background-color","#1A3C49");
            $("body").css("transition","none");
            setTimeout(function(){
                //$("body").css("transition","background-color 0.8s linear");
                $("body").css("background-color","#04212F")
            },30);
            
            rocketsRemaining--;
            if ( rocketsRemaining == 0 ){
                canSend = false;
                rocketsRemaining = ROCKETS_AMOUNT;
                timeRemaining = waitTime;
				$("#send").css("pointer-events","none");
				$("#send").addClass("disabled");
                $(".orient-arrow img").attr("src","images/orientation-disabled.png");
                $("#send").find(".fa-rocket").removeClass("fa-rocket").addClass("fa-clock-o");
                $("#send").find(".btn-text").html(timeRemaining + " sec...");
                pleaseWaitInterval = setInterval(function(){
                    if ( !canSend ){
                        timeRemaining--;
                        $("#send").find(".btn-text").html(timeRemaining + " sec...");
                    }else{
                        clearInterval(pleaseWaitInterval);
                    }
                },1000);
				setTimeout(function(){
                    canSend = true;
					$("#send").css("pointer-events","all");
					$("#send").removeClass("disabled");
                    $(".orient-arrow img").attr("src","images/orientation.png");
                    $("#send").find(".fa-clock-o").removeClass("fa-clock-o").addClass("fa-rocket");
                    $("#send").find(".btn-text").html("Lancer!");
				},waitTime*1000);
            }
		    $.ajax({
		        url:global.pmw.options.serverUrl+"/fireworks",
		        type: 'post',
		        data:{
		            type:parseInt(selectedFirework),
                    angle: -angle,
                    primaryColor: this.primaryColor,
                    secondaryColor: this.secondaryColor,
                    power: power,
		        },
	        }).done(function (data){
                data = JSON.parse(data);
                if ( data.responseType == "ok" ){
	                M.Toast.show("Ton feu d'artifice a été envoyée! Lève les yeux.");
                }else{
                    M.Toast.show("Erreur :( Es-tu toujours connecté à internet?");
                    return;
                }
			});
        },
        
		fillGallery: function(list){
            var sendId = 0;
			for(var i in list){
				var slide = $('<div class="image">' + list[i] + '</div>')
                slide.attr("data-fireworks-name", i);
				$("#fireworks-gallery").append(slide)
			}
		},
        
        setPrimaryColor: function(color){
            $(".color1 path, .color1 circle, .color1 polygon").css("fill", color);
            this.primaryColor = color;
        },
        
        setSecondaryColor: function(color){
            $(".color2 path, .color2 circle, .color2 polygon").css("fill",color);
            this.secondaryColor = color;
        }
    });

})(this);
