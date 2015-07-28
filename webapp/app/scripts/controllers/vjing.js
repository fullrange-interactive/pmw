/*global pmw, $*/

pmw.Controllers = pmw.Controllers || {};

(function (global) {
    'use strict';

    var helpGone = false;
    var canSend = true;
    var waitTime = 5;
    var timeRemaining = 4;
    var pleaseWaitInterval = null;
    
    function shuffle(o){
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

    pmw.Controllers.VJingController = pmw.Controllers.AbstractController.extend({

        pageHeadline: M.I18N.get('vjing.title'),

        _initViews: function() {
            backRoute = "#chooseFeature";
            // Create the ContentView with the controller (this) as scope
            if( !this.contentView ) {
                this.contentView = pmw.Views.VJingView.create(this, null, true);
            }

            // Create the HeaderView with the controller (this) as scope
            if( !this.headerView ) {
                this.headerView = pmw.Views.BackheaderView.create(this, null, true);
            }

            this._applyViews();
			
			var that = this;
			$.get(global.pmw.options.serverUrl+"/vjing", {
				listImages:1
			},function (data){
				that.vjImages = data;
				that.fillGallery(that);
				$("#vjing-gallery").slick({
				    lazyLoad:'ondemand',
                    prevArrow:'#slide-previous',
                    nextArrow:'#slide-next'
				});
			},'json');

            window.addEventListener('resize', this.resizeCanvas, false);
            window.addEventListener('orientationchange', this.resizeCanvas, false);
			
            this.resizeCanvas();
            
            $("#vjing-gallery").on("tap",function(e){
                e.preventDefault();
                if ( helpGone === true ){
                    this.sendClip();
                }
            }.bind(this));
			
			$(".page-vjing").on("touch",function(){
				$("#vjing-help").fadeOut(500,function(){helpGone = true;console.log("helpgone")});
			})
			$(".page-vjing").on("touchstart",function(){
				$("#vjing-help").fadeOut(500,function(){helpGone = true;console.log("helpgone")});
			})
			$(".page-vjing").on("click",function(){
				$("#vjing-help").fadeOut(500,function(){helpGone = true;console.log("helpgone")});
			})
            setTimeout(function (){
                $("#vjing-help").fadeOut(500,function(){helpGone = true;console.log("helpgone")});
            },3000)
			
			setTimeout(function(){
				$("#vjing-gallery").trigger("resize");
			},100)
            var current = this;
        },
		
		fillGallery: function(){
            this.vjImages = shuffle(this.vjImages);
			for(var i = 0; i < this.vjImages.length; i++){
				var slide = $('<div class="image"><img data-lazy="' + global.pmw.options.serverUrl + this.vjImages[i] + '"/></div>')
				$("#vjing-gallery").append(slide)
			}
		},
		
        sendClip: function(){
            if ( !canSend ){
                return;
            }
            canSend = false;
            var current = this;
			var selectedClip;
			$("#vjing-gallery").find("div.image").each(function (){
				if ( $(this).hasClass("slick-active") ){
					selectedClip = $(this).find("img").attr("src");
				}
			})
            console.log("sendClip")
            $("#vjing-flash").css("display","block")
            $("#vjing-flash").css("transition","all 0.05s linear");
            $("#vjing-flash").css("opacity",0.8);
            setTimeout(function(){
                $("#vjing-flash").css("transition","all 1.5s linear");
                $("#vjing-flash").css("opacity",0)
                setTimeout(function(){
                    $("#vjing-flash").css("display","none")
                },2000)
            },100)
		    $.ajax({
		        url:global.pmw.options.serverUrl+"/vjing",
		        type: 'post',
		        data:{
		            clip:selectedClip,
					groupId:global.pmw.selectedWindowGroup
		        },
	        }).done(function (data){
                data = JSON.parse(data);
                if ( data.responseType == "ok" ){
	                M.Toast.show("Ta boucle a été envoyée! Lève les yeux.");
                }else{
                    M.Toast.show("Erreur :( Es-tu toujours connecté à internet?");
                    return;
                }
                timeRemaining = waitTime;
				$("#send").css("pointer-events","none");
				$("#send").addClass("disabled");
                $("#send").find(".fa-rocket").removeClass("fa-rocket").addClass("fa-clock-o");
                $("#send").find(".btn-text").html("Attendre " + timeRemaining + " secondes...");
                pleaseWaitInterval = setInterval(function(){
                    if ( !canSend ){
                        timeRemaining--;
                        $("#send").find(".btn-text").html("Attendre " + timeRemaining + " secondes...");
                    }else{
                        clearInterval(pleaseWaitInterval);
                    }
                },1000);
				setTimeout(function(){
                    canSend = true;
					$("#send").css("pointer-events","all");
					$("#send").removeClass("disabled");
                    $("#send").find(".fa-clock-o").removeClass("fa-clock-o").addClass("fa-rocket");
                    $("#send").find(".btn-text").html("Envoyer");
				},waitTime*1000)
			});
        },
		
        resizeCanvas: function() {
            var winHeight = window.innerHeight ? window.innerHeight : $(window).height();
            var winWidth = $(window).width();
            var newWidth = 0;
            var newHeight = 0;
            var heightMargin = $('.toolbarview').height() + $('.tools').height();

            // windows size without header and footer
            winHeight = winHeight - heightMargin;

            $('#vjing-gallery').height(winHeight);
        }
    });

})(this);
