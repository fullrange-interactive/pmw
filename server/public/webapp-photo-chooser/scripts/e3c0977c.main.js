!function(a){"use strict";a.pmw=a.pmw||{},a.pmw.mconfig={name:"pmw",serverUrl:"http://bill.pimp-my-wall.ch/",routes:{"":"choosePhotoController"}}}(this);var fakeLocalStorage=function(){var a,b={};window.Storage&&window.localStorage?a=window.Storage.prototype:(window.localStorage={},a=window.localStorage),window.location.origin||(window.location.origin=window.location.protocol+"//"+window.location.hostname+(window.location.port?":"+window.location.port:""));var c=function(b,c){var d=null==b?null:a.getItem(b),e=location.href.substr(location.origin.length),f=document.createEvent("StorageEvent");f.initStorageEvent("storage",!1,!1,b,d,c,e,null),window.dispatchEvent(f)};a.key=function(a){var c=Object.keys(b)[a];return"string"==typeof c?c:null},a.getItem=function(a){return"string"==typeof b[a]?b[a]:null},a.setItem=function(a,d){c(a,d),b[a]=String(d)},a.removeItem=function(a){c(a,null),delete b[a]},a.clear=function(){c(null,null),b={}}};if("object"==typeof window.localStorage)try{localStorage.setItem("localStorageTest",1),localStorage.removeItem("localStorageTest")}catch(e){fakeLocalStorage()}else fakeLocalStorage();var backRoute;!function(a){"use strict";a.pmw=M.Application.extend().create(a.pmw.mconfig),$(document).ready(function(){var b=a.location.href.split("#");b.length>1&&(a.location.href=b[0],docCookies.setItem("after-anchor",b[1])),a.pmw.selectedWindowGroup=localStorage.getItem("selectedWindowGroup"),a.pmw.start({routing:{routes:a.pmw.options.routes,choosePhotoController:a.pmw.Controllers.ChoosePhotoController.create()}})})}(this),this.JST=this.JST||{},pmw.Models=pmw.Models||{},function(){"use strict";pmw.Models.TmpviewModel=M.Model.extend({})}(),pmw.Collections=pmw.Collections||{},function(){"use strict";pmw.Collections.TmpviewsCollection=M.Collection.extend({model:pmw.Models.TmpviewModel})}(),pmw.Views=pmw.Views||{},function(){"use strict";pmw.Views.BackheaderView=M.ToolbarView.extend({scopeKey:"pageHeadline"},{first:M.ButtonView.extend({icon:"fa-angle-left",events:{tap:function(){pmw.navigate({route:backRoute,transition:M.PageTransitions.CONST.MOVE_TO_RIGHT_FROM_LEFT})}}}),second:M.View.extend({useElement:YES,template:'<div class="logo"><img src="images/Logo.png" /></div>'})})}(),pmw.Views=pmw.Views||{},function(){"use strict";pmw.Views.ChoosePhotoView=M.View.extend({cssClass:"page-choose-photo",template:'<div id="fb-root"></div>'},{area:M.View.extend({useElement:YES,template:'<div class="photo-gallery" id="photo-gallery"></div><button class="next" id="slide-next"><i class="fa fa-chevron-right"></i></button><button class="previous" id="slide-previous"><i class="fa fa-chevron-left"></i></button>'}),logo:M.ImageView.extend({cssClass:"header-logo",value:"images/logo-mybcvs.png"}),modalContainer:M.View.extend({cssClass:"modal-alert-container"},{modalWindow:M.View.extend({cssClass:"modal-alert-window"},{text:M.View.extend({cssClass:"modal-alert-text"}),okButton:M.ButtonView.extend({value:"OK",cssClass:"ok-button",events:{tap:"closeModalAlert"}})})})})}(),pmw.Controllers=pmw.Controllers||{},function(){"use strict";pmw.Controllers.AbstractController=M.Controller.extend({headerView:null,contentView:null,menuView:null,pageHeadline:"",applicationStart:function(a){var b=M.SwitchHeaderContentLayout.extend({}).create(this,null,!0);pmw.setLayout(b),this._initViews(a)},show:function(a){this._initViews(a);var b=M.SwitchHeaderContentLayout.extend({}).create(this,null,!0);b._type===pmw.getLayout()._type?pmw.getLayout().startTransition():this.applicationStart()},applicationReady:function(){},_applyViews:function(){pmw.getLayout().applyViews({header:this.headerView,content:this.contentView})},_initViews:function(){}})}(),pmw.Controllers=pmw.Controllers||{},function(a){"use strict";pmw.Controllers.MenuController=pmw.Controllers.AbstractController.extend({tmpViews:null,_initViews:function(){this.contentView||(this.contentView=pmw.Views.HomeView.create(this,null,!0)),this.headerView||(this.headerView=M.ToolbarView.extend({grid:"col-md-12",value:"Pimp My Wall"}).create()),this._applyViews()},setLocationAndChooseFeature:function(b){a.pmw.selectedWindowGroup=b,localStorage.setItem("selectedWindowGroup",b),pmw.navigate({route:"/chooseFeature"})}})}(this),pmw.Controllers=pmw.Controllers||{},function(a){"use strict";function b(a){for(var b,c,d=a.length;d;b=Math.floor(Math.random()*d),c=a[--d],a[d]=a[b],a[b]=c);return a}var c=0;pmw.Controllers.ChoosePhotoController=pmw.Controllers.AbstractController.extend({photos:[],_initViews:function(){this.contentView||(this.contentView=pmw.Views.ChoosePhotoView.create(this,null,!0)),this._applyViews();var b=this;$.get(a.pmw.options.serverUrl+"/photoGallery",{listImages:1},function(a){b.photos=a,b.fillGallery(b),$("#photo-gallery").slick({prevArrow:"#slide-previous",nextArrow:"#slide-next",touchThreshold:20}),$("#photo-gallery").on("beforeChange",b.onChange)},"json"),window.addEventListener("resize",this.resizeCanvas,!1),window.addEventListener("orientationchange",this.resizeCanvas,!1)},fillGallery:function(){this.photos=b(this.photos);for(var c=0;c<this.photos.length;c++){var d=$('<div class="image" data-image-source="'+a.pmw.options.serverUrl+this.photos[c]+'" style="background-image:url('+a.pmw.options.serverUrl+this.photos[c]+')"></div>');$("#photo-gallery").append(d)}},onChange:function(b,d,e,f){{var g=$("#photo-gallery").find("div.image[data-slick-index="+f+"]").attr("data-image-source");(new Date).getTime()}console.log("selectedImage = "+g),c=(new Date).getTime(),$.get(a.pmw.options.serverUrl+"/photoGallery",{imageUrl:g},function(){}).fail(function(){console.log("Problème d'envoi au serveur")})},resizeCanvas:function(){window.innerHeight?window.innerHeight:$(window).height(),$(window).width(),$(".toolbarview").height()+$(".tools").height()}})}(this);