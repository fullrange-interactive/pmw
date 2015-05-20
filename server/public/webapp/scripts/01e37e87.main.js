!function(a){"use strict";a.pmw=a.pmw||{},a.pmw.mconfig={name:"pmw",locales:[{locale:"en"}],debugView:NO,serverUrl:"http://baleinev.ch:8000"}}(this);var fakeLocalStorage=function(){var a,b={};window.Storage&&window.localStorage?a=window.Storage.prototype:(window.localStorage={},a=window.localStorage),window.location.origin||(window.location.origin=window.location.protocol+"//"+window.location.hostname+(window.location.port?":"+window.location.port:""));var c=function(b,c){var d=null==b?null:a.getItem(b),e=location.href.substr(location.origin.length),f=document.createEvent("StorageEvent");f.initStorageEvent("storage",!1,!1,b,d,c,e,null),window.dispatchEvent(f)};a.key=function(a){var c=Object.keys(b)[a];return"string"==typeof c?c:null},a.getItem=function(a){return"string"==typeof b[a]?b[a]:null},a.setItem=function(a,d){c(a,d),b[a]=String(d)},a.removeItem=function(a){c(a,null),delete b[a]},a.clear=function(){c(null,null),b={}}};if("object"==typeof window.localStorage)try{localStorage.setItem("localStorageTest",1),localStorage.removeItem("localStorageTest")}catch(e){fakeLocalStorage()}else fakeLocalStorage();var backRoute;!function(a){"use strict";a.pmw=M.Application.extend().create(a.pmw.mconfig),$(document).ready(function(){a.pmw.selectedWindowGroup=localStorage.getItem("selectedWindowGroup"),a.pmw.start({routing:{routes:{"":"menuController",draw:"drawController",drawPhoto:"drawphotoController",vjing:"vjingController",chooseFeature:"chooseFeatureController"},menuController:a.pmw.Controllers.MenuController.create(),drawController:a.pmw.Controllers.DrawController.create(),drawphotoController:a.pmw.Controllers.DrawphotoController.create(),vjingController:a.pmw.Controllers.VJingController.create(),chooseFeatureController:a.pmw.Controllers.ChooseFeatureController.create()}})})}(this),this.JST=this.JST||{},pmw.Models=pmw.Models||{},function(){"use strict";pmw.Models.TmpviewModel=M.Model.extend({})}(),pmw.Collections=pmw.Collections||{},function(){"use strict";pmw.Collections.TmpviewsCollection=M.Collection.extend({model:pmw.Models.TmpviewModel})}(),pmw.Views=pmw.Views||{},function(){"use strict";pmw.Views.BackheaderView=M.ToolbarView.extend({scopeKey:"pageHeadline"},{first:M.ButtonView.extend({icon:"fa-angle-left",events:{tap:function(){pmw.navigate({route:backRoute,transition:M.PageTransitions.CONST.MOVE_TO_RIGHT_FROM_LEFT})}}}),second:M.View.extend({useElement:YES,template:'<div class="logo"><img src="images/Logo.png" /></div>'})})}(),pmw.Views=pmw.Views||{},function(){"use strict";pmw.Views.HomeView=M.View.extend({grid:"row"},{tower:M.ImageView.extend({grid:"col-xs-6",cssClass:"col-sm-4 col-md-3 text-center app-icon",value:"images/tower.png",events:{tap:function(){this.setLocationAndChooseFeature("53562d9d3d45fe516a96d161")}}}),entrance:M.ImageView.extend({grid:"col-xs-6",cssClass:"col-sm-4 col-md-3 text-center app-icon",value:"images/entrance.png",events:{tap:function(){this.setLocationAndChooseFeature("553167e13452c2aeefa46bee")}}}),mainStage:M.ImageView.extend({grid:"col-xs-6",cssClass:"col-sm-4 col-md-3 text-center app-icon",value:"images/main-stage.png",events:{tap:function(){this.setLocationAndChooseFeature("55565afe8a8dbbeb37f4b1f1")}}}),interior:M.ImageView.extend({grid:"col-xs-6",cssClass:"col-sm-4 col-md-3 text-center app-icon",value:"images/cafeteria.png",events:{tap:function(){this.setLocationAndChooseFeature("55565adc8a8dbbeb37f4b1f0")}}})})}(),pmw.Views=pmw.Views||{},function(){"use strict";pmw.Views.DrawView=M.View.extend({cssClass:"page-draw",template:'<div id="fb-root"></div>'},{tools:M.View.extend({grid:"row",cssClass:"tools toolbarview"},{foregroundColor:M.TextfieldView.extend({grid:"col-xs-2",value:"",cssClass:"colorpicker foreground",type:"text"}),backgroundColor:M.TextfieldView.extend({grid:"col-xs-2",value:"",cssClass:"colorpicker background",type:"text"}),sizeStroke:M.SelectView.extend({grid:"col-xs-2",scopeKey:"selectionSize.size",cssClass:"selectionSize",selectOptions:{collection:[{id:1,name:"small",value:3},{id:2,name:"medium",value:10},{id:3,name:"large",value:20},{id:4,name:"xlarge",value:30}],labelPath:"name",valuePath:"value"},events:{change:"changeSize"}}),undo:M.ButtonView.extend({grid:"col-xs-2 col-sm-2 col-md-2",icon:"fa-undo",value:"",events:{tap:"undo"}}),trash:M.ButtonView.extend({grid:"col-xs-2 col-sm-2 col-md-2",cssClass:"m-error",icon:"fa-trash-o",value:"",events:{tap:"clearDraw"}}),save:M.ButtonView.extend({grid:"col-xs-2 col-sm-2 col-md-2",cssClass:"m-success",icon:"fa-check",value:"",events:{tap:"saveDraw"}})}),area:M.View.extend({useElement:YES,template:'<div title="Social" style="display:none" id="messageBoxSocial"><p>Partager votre dessin sur :</p><p><button id="facebook" type="button" class="btn btn-primary">Facebook</button></p></div><div id="contentCanvas"><p style="text-align:center">Loading Canvas...</p></div>'})})}(),pmw.Views=pmw.Views||{},function(){"use strict";pmw.Views.DrawphotoView=M.View.extend({cssClass:"page-drawphoto",template:'<div id="fb-root"></div>'},{tools:M.View.extend({grid:"row",cssClass:"tools toolbarview"},{background:M.ButtonView.extend({grid:"col-xs-2 col-sm-2 col-md-2",icon:"fa-camera",cssClass:"camera m-primary",value:""}),foregroundColor:M.TextfieldView.extend({grid:"col-xs-2",value:"",cssClass:"colorpicker foreground",type:"text"}),sizeStroke:M.SelectView.extend({grid:"col-xs-2",scopeKey:"selectionSize.size",cssClass:"selectionSize",selectOptions:{collection:[{id:1,name:"small",value:3},{id:2,name:"medium",value:10},{id:3,name:"large",value:20},{id:4,name:"xlarge",value:30}],labelPath:"name",valuePath:"value"},events:{change:"changeSize"}}),undo:M.ButtonView.extend({grid:"col-xs-2 col-sm-2 col-md-2",cssClass:"m-info",icon:"fa-undo",value:"",events:{tap:"undo"}}),trash:M.ButtonView.extend({grid:"col-xs-2 col-sm-2 col-md-2",cssClass:"m-error",icon:"fa-trash-o",value:"",events:{tap:"clearDraw"}}),save:M.ButtonView.extend({grid:"col-xs-2 col-sm-2 col-md-2",cssClass:"m-success",icon:"fa-check",value:"",events:{tap:"saveDraw"}})}),area:M.View.extend({useElement:YES,template:'<div class="contentCanvas drawPhotoCanvas drawPhotoCanvasEmpty"><p style="text-align:center">Loading Canvas...</p></div>'})})}(),pmw.Views=pmw.Views||{},function(){"use strict";pmw.Views.VJingView=M.View.extend({cssClass:"page-vjing",template:'<div id="fb-root"></div>'},{tools:M.View.extend({grid:"row",cssClass:"tools toolbarview"},{send:M.ButtonView.extend({grid:"col-xs-12 col-sm-12 col-md-12",id:"send",cssClass:"m-success pull-right",value:'<i class="fa fa-rocket" /> Envoyer',events:{tap:"sendClip"}})}),area:M.View.extend({useElement:YES,template:'<div class="swipeshow vjing-gallery" id="vjing-gallery"></div><div id="vjing-flash"></div><button class="next" id="slide-next"><i class="fa fa-chevron-right"></i></button><button class="previous" id="slide-previous"><i class="fa fa-chevron-left"></i></button><div id="vjing-help"></div>'})})}(),pmw.Views=pmw.Views||{},function(){"use strict";pmw.Views.ChooseFeatureView=M.View.extend({grid:"row",cssClass:"choose-feature"},{draw:M.ImageView.extend({grid:"col-xs-6",cssClass:"col-sm-4 col-md-3 text-center app-icon",value:"images/drawing.png",events:{tap:function(){this.gotoPage("draw")}}}),drawingPhoto:M.ImageView.extend({grid:"col-xs-6",cssClass:"col-sm-4 col-md-3 text-center app-icon",value:"images/drawingPhoto.png",events:{tap:function(){this.gotoPage("drawPhoto")}}}),vjing:M.ImageView.extend({grid:"col-xs-6",cssClass:"col-sm-4 col-md-3 text-center app-icon",value:"images/vjing.png",events:{tap:function(){this.gotoPage("vjing")}}})})}(),pmw.Controllers=pmw.Controllers||{},function(){"use strict";pmw.Controllers.AbstractController=M.Controller.extend({headerView:null,contentView:null,menuView:null,pageHeadline:"",applicationStart:function(a){var b=M.SwitchHeaderContentLayout.extend({}).create(this,null,!0);pmw.setLayout(b),this._initViews(a)},show:function(a){this._initViews(a);var b=M.SwitchHeaderContentLayout.extend({}).create(this,null,!0);b._type===pmw.getLayout()._type?pmw.getLayout().startTransition():this.applicationStart()},applicationReady:function(){},_applyViews:function(){pmw.getLayout().applyViews({header:this.headerView,content:this.contentView})},_initViews:function(){}})}(),pmw.Controllers=pmw.Controllers||{},function(a){"use strict";pmw.Controllers.MenuController=pmw.Controllers.AbstractController.extend({tmpViews:null,_initViews:function(){this.contentView||(this.contentView=pmw.Views.HomeView.create(this,null,!0)),this.headerView||(this.headerView=M.ToolbarView.extend({grid:"col-md-12",value:"Pimp My Wall"}).create()),this._applyViews()},setLocationAndChooseFeature:function(b){a.pmw.selectedWindowGroup=b,localStorage.setItem("selectedWindowGroup",b),pmw.navigate({route:"/chooseFeature"})}})}(this),pmw.Controllers=pmw.Controllers||{},function(a){"use strict";function b(a,b){localStorage.removeItem("Strokes"),e.push({points:[{x:a,y:b},{x:a+1,y:b+1}],color:h,lineWidth:i}),localStorage.setItem("Strokes",JSON.stringify(e))}var c,d,e,f,g=null,h="#000000",i=10;pmw.Controllers.DrawController=pmw.Controllers.AbstractController.extend({pageHeadline:"Dessin",selectionSize:M.Model.create({size:5}),strokesMin:10,palette:[["FFFFFF","FF0000","94c13c","0000FF"],["000000","964B00","07ace2","F57900"],["e5287b","75507B","FCE94F","888888"],["008800"]],backgroundColor:null,_initViews:function(){backRoute="#chooseFeature",this.contentView||(this.contentView=pmw.Views.DrawView.create(this,null,!0)),this.headerView||(this.headerView=pmw.Views.BackheaderView.create(this,null,!0)),this._applyViews();var a=this,b=[];for(var c in this.palette)for(var d in this.palette[c])b.push(this.palette[c][d]);localStorage.getItem("Background")||(this.backgroundColor="#"+b[Math.floor(Math.random()*b.length)]),$(".colorpicker.background input").spectrum({showPaletteOnly:!0,showPalette:!0,color:a.backgroundColor,palette:a.palette,change:function(b){a.setBackgroundColor(b.toHexString()),localStorage.setItem("Background",b.toHexString())}}),$(".colorpicker.foreground input").spectrum({showPaletteOnly:!0,showPalette:!0,color:h,palette:a.palette,change:function(a){h=a.toHexString(),localStorage.setItem("Foreground",a.toHexString())}}),$(".selectionSize .selection-list").sizeChooser(this.changeSize),this.newCanvas()},setBackgroundColor:function(a){this.backgroundColor=a,localStorage.setItem("Background",a),$(".colorpicker.background input").spectrum("set",a.replace("#","")),c.fillStyle=a,c.fillRect(0,0,f.width,f.height),c.fillStyle=h,this.repaint()},newCanvas:function(){f='<canvas id="canvas" width="'+$(window).width()+'" height="'+($(window).height()-$(".toolbarview").height()-$(".tools").height())+'"></canvas>',$("#contentCanvas").html(f),f=$("#contentCanvas canvas")[0],c=$("#contentCanvas canvas")[0].getContext("2d"),window.addEventListener("resize",this.resizeCanvas.bind(this),!1),window.addEventListener("orientationchange",this.resizeCanvas.bind(this),!1),this.resizeCanvas(),null!==localStorage.getItem("Strokes")?(e=JSON.parse(localStorage.getItem("Strokes")),this.repaint()):e=[],c.strokeStyle=localStorage.getItem("Foreground")?localStorage.getItem("Foreground"):h,c.lineWidth=i,c.lineCap="round",c.lineJoin="round",this.setBackgroundColor(localStorage.getItem("Background")?localStorage.getItem("Background"):this.backgroundColor),$("#contentCanvas canvas").drawTouch(),$("#contentCanvas canvas").drawPointer(),$("#contentCanvas canvas").drawMouse(),$("#facebook").click(postToWall)},clearDraw:function(){var a=[];for(var b in this.palette)for(var c in this.palette[b])a.push(this.palette[b][c]);this.setBackgroundColor("#"+a[Math.floor(Math.random()*a.length)]),localStorage.removeItem("Background"),localStorage.removeItem("Strokes"),localStorage.removeItem("Foreground"),this.newCanvas()},changeSize:function(){i=$(".selectionSize select").val(),c.lineWidth=i},undo:function(){e.pop(),this.repaint()},saveDraw:function(){var b=this;$('<div title="Confirmation">Envoyer le dessin ?</div>').dialog({resizable:!1,height:200,modal:!0,draggable:!1,buttons:{Non:function(){$(this).dialog("close")},Oui:function(){var c=e;console.log(c),$.ajax({url:a.pmw.options.serverUrl+"/drawing",type:"post",data:{action:"newDrawing",strokes:c,width:f.width,height:f.height,groupId:a.pmw.selectedWindowGroup,backgroundColor:b.backgroundColor}}).done(function(a){a=jQuery.parseJSON(a),"ok"==a.responseType?(M.Toast.show("Ton dessin a été envoyé! Nos modérateurs vont y jeter un oeil."),b.clearDraw()):M.Toast.show("Erreur lors de l'envoi ! :( Es-tu connecté à internet?")}),$(this).dialog("close")}}})},drawLine:function(a,b,d,e,f,g){c.beginPath(),c.lineCap="round",c.lineJoin="round",c.strokeStyle=a,c.lineWidth=b,c.moveTo(d,e),c.lineTo(f,g),c.stroke(),c.closePath()},resizeCanvas:function(){console.log("resize");var a=1/1.206897,b=window.innerHeight?window.innerHeight:$(window).height(),d=$(window).width(),e=0,g=0,h=$(".toolbarview").height()+$(".tools").height();b-=h,1>d/b?(e=d,g=e*a):(g=b,e=g/a);var i=c.getImageData(0,0,f.width,f.height);f.width=e,f.height=g,$("#contentCanvas").height(b),c.putImageData(i,0,0),this.repaint()},repaint:function(){if(e){c.fillStyle=this.backgroundColor,c.clearRect(0,0,f.width,f.height),c.fillRect(0,0,f.width,f.height);for(var a=0;a<e.length;a++)for(var b=0;b<e[a].points.length-1;b++)this.drawLine(e[a].color,e[a].lineWidth,e[a].points[b].x,e[a].points[b].y,e[a].points[b+1].x,e[a].points[b+1].y)}c.lineWidth=i}}),$.fn.drawTouch=function(){var a=function(a){a=a.originalEvent,c.beginPath(),c.strokeStyle=h,d=a.changedTouches[0].pageX,g=a.changedTouches[0].pageY-100,c.moveTo(d,g),c.lineTo(d+1,g+1),c.stroke(),b(d,g),M.Logger.log("new stroke")},f=function(a){a.preventDefault(),a=a.originalEvent,d=a.changedTouches[0].pageX,g=a.changedTouches[0].pageY-100,c.lineTo(d,g),c.stroke(),e[e.length-1].points.push({x:d,y:g})};$(this).on("touchstart",a.bind(this)),$(this).on("touchmove",f.bind(this))},$.fn.drawPointer=function(){var a=function(a){a=a.originalEvent,c.beginPath(),c.strokeStyle=h,d=a.pageX,g=a.pageY-100,c.moveTo(d,g),b(d,g),M.Logger.log("new stroke")},f=function(a){a.preventDefault(),a=a.originalEvent,d=a.pageX,g=a.pageY-100,c.lineTo(d,g),c.stroke(),e[e.length-1].points.push({x:d,y:g})};$(this).on("MSPointerDown",a),$(this).on("MSPointerMove",f)},$.fn.drawMouse=function(){var a=0,f=function(e){a=1,c.beginPath(),c.strokeStyle=h,d=e.pageX,g=e.pageY-100,c.moveTo(d,g),b(d,g),M.Logger.log("new stroke")},i=function(b){a&&(d=b.pageX,g=b.pageY-100,c.lineTo(d,g),c.stroke(),e[e.length-1].points.push({x:d,y:g}))},j=function(){a=0};$(this).on("mousedown",f),$(this).on("mousemove",i),$(window).on("mouseup",j)}}(this),pmw.Controllers=pmw.Controllers||{},function(a){"use strict";function b(a,b){localStorage.removeItem("StrokesPhoto"),e.push({points:[{x:a,y:b},{x:a+1,y:b+1}],color:h,lineWidth:i}),localStorage.setItem("StrokesPhoto",JSON.stringify(e))}var c,d,e,f,g=null,h="#000000",i=10;pmw.Controllers.DrawphotoController=pmw.Controllers.AbstractController.extend({pageHeadline:"Photo",selectionSize:M.Model.create({size:5}),strokesMin:10,palette:[["FFFFFF","FF0000","94c13c","0000FF"],["000000","964B00","07ace2","F57900"],["e5287b","75507B","FCE94F","888888"],["008800"]],background:null,_initViews:function(){backRoute="#chooseFeature",this.contentView||(this.contentView=pmw.Views.DrawphotoView.create(this,null,!0)),this.headerView||(this.headerView=pmw.Views.BackheaderView.create(this,null,!0)),this._applyViews();var a=this,b=[];for(var c in this.palette)for(var d in this.palette[c])b.push(this.palette[c][d]);$(".page-drawphoto .colorpicker.foreground input").spectrum({showPaletteOnly:!0,showPalette:!0,color:h,palette:a.palette,change:function(a){h=a.toHexString(),localStorage.setItem("ForegroundPhoto",a.toHexString())}}),$(".page-drawphoto .selectionSize .selection-list").sizeChooser(this.changeSize),this.newCanvas(),$(".page-drawphoto .camera").prepend('<input type="file" capture="camera" accept="image/*" id="takePictureField">'),$(".page-drawphoto #takePictureField").on("change",this.gotPic.bind(this)),!("url"in window)&&"webkitURL"in window&&(window.URL=window.webkitURL)},newCanvas:function(){f='<canvas id="canvasDrawPhoto" width="'+$(window).width()+'" height="'+($(window).height()-$(".page-drawphoto .toolbarview").height()-$(".page-drawphoto .tools").height())+'"></canvas>',$(".page-drawphoto .contentCanvas").html(f),f=$(".page-drawphoto .contentCanvas canvas")[0],c=$(".page-drawphoto .contentCanvas canvas")[0].getContext("2d"),console.log(c),window.addEventListener("resize",this.resizeCanvas.bind(this),!1),window.addEventListener("orientationchange",this.resizeCanvas.bind(this),!1),this.resizeCanvas(),null!==localStorage.getItem("StrokesPhoto")?(e=JSON.parse(localStorage.getItem("StrokesPhoto")),this.repaint()):e=[],c.strokeStyle=localStorage.getItem("ForegroundPhoto")?localStorage.getItem("ForegroundPhoto"):h,localStorage.getItem("BackgroundDrawPhoto")&&($(".page-drawphoto canvas").css("background","url("+localStorage.getItem("BackgroundDrawPhoto")+")").css("background-size","cover").css("background-position","50% 50%"),this.background=localStorage.getItem("BackgroundDrawPhoto")),c.lineWidth=i,c.lineCap="round",c.lineJoin="round",$(".page-drawphoto .contentCanvas canvas").drawTouchPhoto(),$(".page-drawphoto .contentCanvas canvas").drawPointerPhoto(),$(".page-drawphoto .contentCanvas canvas").drawMousePhoto()},clearDraw:function(){$(".drawPhotoCanvas").addClass("drawPhotoCanvasEmpty");var a=[];for(var b in this.palette)for(var c in this.palette[b])a.push(this.palette[b][c]);localStorage.removeItem("StrokesPhoto"),localStorage.removeItem("ForegroundPhoto"),localStorage.removeItem("BackgroundDrawPhoto"),this.newCanvas(),this.repaint()},changeSize:function(){i=$(".page-drawphoto .selectionSize select").val(),c.lineWidth=i},undo:function(){e.pop(),this.repaint()},saveDraw:function(){var b=this;console.log(b.background),$('<div title="Confirmation">Envoyer le dessin ?</div>').dialog({resizable:!1,height:200,modal:!0,draggable:!1,buttons:{Non:function(){$(this).dialog("close")},Oui:function(){var c=e;$.ajax({url:a.pmw.options.serverUrl+"/drawing",type:"post",data:{action:"newDrawing",strokes:c,width:f.width,height:f.height,groupId:a.pmw.selectedWindowGroup,background:localStorage.getItem("BackgroundDrawPhoto")}}).done(function(a){b.clearDraw(),console.log(b.background),a=jQuery.parseJSON(a),M.Toast.show("ok"==a.responseType?"Ton dessin a été envoyé! Nos modérateurs vont y jeter un oeil.":"Erreur lors de l'envoi ! :(")}),$(this).dialog("close")}}})},drawLine:function(a,b,d,e,f,g){c.beginPath(),c.lineCap="round",c.lineJoin="round",c.strokeStyle=a,c.lineWidth=b,c.moveTo(d,e),c.lineTo(f,g),c.stroke(),c.closePath()},resizeCanvas:function(){console.log("resize");var a=1/1.206897,b=window.innerHeight?window.innerHeight:$(window).height(),d=$(window).width(),e=0,g=0,h=$(".page-drawphoto .toolbarview").height()+$(".page-drawphoto .tools").height();b-=h,1>d/b?(e=d,g=e*a):(g=b,e=g/a);var i=c.getImageData(0,0,f.width,f.height);f.width=e,f.height=g,$(".page-drawphoto .contentCanvas").height(b),c.putImageData(i,0,0),this.repaint()},repaint:function(){if(e){c.clearRect(0,0,f.width,f.height);for(var a=0;a<e.length;a++)for(var b=0;b<e[a].points.length-1;b++)this.drawLine(e[a].color,e[a].lineWidth,e[a].points[b].x,e[a].points[b].y,e[a].points[b+1].x,e[a].points[b+1].y)}c.lineWidth=i},gotPic:function(b){if(1==b.target.files.length&&0==b.target.files[0].type.indexOf("image/")){var c=(URL.createObjectURL(b.target.files[0]),this),d=new FormData;d.append("file",b.target.files[0]);var e=M.LoaderView.create().render();e.show("Chargement"),$.ajax({url:a.pmw.options.serverUrl+"/photo",type:"post",data:d,processData:!1,contentType:!1,responseType:"json"}).done(function(b){$(".drawPhotoCanvas").removeClass("drawPhotoCanvasEmpty"),console.log("gotPix"),this.clearDraw(),this.repaint(),c.background=JSON.parse(b).url,$(".page-drawphoto canvas").css("background","url("+a.pmw.options.serverUrl+"/"+c.background+")"),$(".page-drawphoto canvas").css("background-size","cover"),$(".page-drawphoto canvas").css("background-position","50% 50%"),console.log("background Img : "+c.background),localStorage.setItem("BackgroundDrawPhoto",c.background),e.hide(!0)}.bind(this))}}}),$.fn.drawTouchPhoto=function(){var a=function(a){a=a.originalEvent,c.beginPath(),c.strokeStyle=h,d=a.changedTouches[0].pageX,g=a.changedTouches[0].pageY-100,c.moveTo(d,g),c.lineTo(d+1,g+1),c.stroke(),b(d,g),M.Logger.log("new stroke")},f=function(a){a.preventDefault(),a=a.originalEvent,d=a.changedTouches[0].pageX,g=a.changedTouches[0].pageY-100,c.lineTo(d,g),c.stroke(),e[e.length-1].points.push({x:d,y:g})};$(this).on("touchstart",a),$(this).on("touchmove",f)},$.fn.drawPointerPhoto=function(){var a=function(a){a=a.originalEvent,c.beginPath(),c.strokeStyle=h,d=a.pageX,g=a.pageY-100,c.moveTo(d,g),c.lineTo(d+1,g+1),c.stroke(),b(d,g),M.Logger.log("new stroke")},f=function(a){a.preventDefault(),a=a.originalEvent,d=a.pageX,g=a.pageY-100,c.lineTo(d,g),c.stroke(),e[e.length-1].points.push({x:d,y:g})};$(this).on("MSPointerDown",a),$(this).on("MSPointerMove",f)},$.fn.drawMousePhoto=function(){var a=0,f=function(e){a=1,c.beginPath(),c.strokeStyle=h,d=e.pageX,g=e.pageY-100,c.moveTo(d,g),c.lineTo(d+1,g+1),c.stroke(),b(d,g),M.Logger.log("new stroke")},i=function(b){a&&(d=b.pageX,g=b.pageY-100,c.lineTo(d,g),c.stroke(),e[e.length-1].points.push({x:d,y:g}))},j=function(){a=0};$(this).on("mousedown",f),$(this).on("mousemove",i),$(window).on("mouseup",j)}}(this),pmw.Controllers=pmw.Controllers||{},function(a){"use strict";var b=!1,c=!0;pmw.Controllers.VJingController=pmw.Controllers.AbstractController.extend({pageHeadline:M.I18N.get("vjing.title"),_initViews:function(){backRoute="#chooseFeature",this.contentView||(this.contentView=pmw.Views.VJingView.create(this,null,!0)),this.headerView||(this.headerView=pmw.Views.BackheaderView.create(this,null,!0)),this._applyViews();var c=this;$.get(a.pmw.options.serverUrl+"/vjing",{listImages:1},function(a){c.vjImages=a,c.fillGallery(c),$("#vjing-gallery").slick({lazyLoad:"ondemand",prevArrow:"#slide-previous",nextArrow:"#slide-next"})},"json"),window.addEventListener("resize",this.resizeCanvas,!1),window.addEventListener("orientationchange",this.resizeCanvas,!1),this.resizeCanvas(),$("#vjing-gallery .slides").on("tap",function(a){a.preventDefault(),b===!0&&this.sendClip()}.bind(this)),$(".page-vjing").on("touch",function(){$("#vjing-help").fadeOut(500,function(){b=!0,console.log("helpgone")})}),$(".page-vjing").on("touchstart",function(){$("#vjing-help").fadeOut(500,function(){b=!0,console.log("helpgone")})}),$(".page-vjing").on("click",function(){$("#vjing-help").fadeOut(500,function(){b=!0,console.log("helpgone")})}),setTimeout(function(){$("#vjing-help").fadeOut(500,function(){b=!0,console.log("helpgone")})},3e3),setTimeout(function(){$("#vjing-gallery").trigger("resize")},100)},fillGallery:function(){for(var b=0;b<this.vjImages.length;b++){var c=$("<div></div>");c.addClass("slide"),c.html('<div class="image"><img data-lazy="'+a.pmw.options.serverUrl+this.vjImages[b]+'"/></div>'),$("#vjing-gallery").append(c)}},sendClip:function(){if(c){c=!1;var b;$("#vjing-gallery").find("div").each(function(){$(this).hasClass("active")&&(b=$(this).find("img").attr("src"))}),console.log("sendClip"),$("#vjing-flash").css("display","block"),$("#vjing-flash").css("transition","all 0.05s linear"),$("#vjing-flash").css("opacity",.8),setTimeout(function(){$("#vjing-flash").css("transition","all 1.5s linear"),$("#vjing-flash").css("opacity",0),setTimeout(function(){$("#vjing-flash").css("display","none")},2e3)},100),$.ajax({url:a.pmw.options.serverUrl+"/vjing",type:"post",data:{clip:b,groupId:a.pmw.selectedWindowGroup}}).done(function(a){return a=JSON.parse(a),"ok"!=a.responseType?void M.Toast.show("Erreur :( Es-tu toujours connecté à internet?"):(M.Toast.show("Ta boucle a été envoyée! Lève les yeux."),$("#send").css("pointer-events","none"),$("#send").addClass("disabled"),void setTimeout(function(){c=!0,$("#send").css("pointer-events","all"),$("#send").removeClass("disabled")},2e3))})}},resizeCanvas:function(){var a=window.innerHeight?window.innerHeight:$(window).height(),b=($(window).width(),$(".toolbarview").height()+$(".tools").height());a-=b,$("#vjing-gallery").height(a)}})}(this),pmw.Controllers=pmw.Controllers||{},function(a){"use strict";pmw.Controllers.ChooseFeatureController=pmw.Controllers.AbstractController.extend({pageHeadline:"Choisis un truc",_initViews:function(){backRoute="/",this.contentView||(this.contentView=pmw.Views.ChooseFeatureView.create(this,null,!0)),this.headerView||(this.headerView=pmw.Views.BackheaderView.create(this,null,!0)),this._applyViews()},fillGallery:function(){for(var b=0;b<this.vjImages.length;b++){var c=$("<li>");c.addClass("slide"),c.html('<img src="'+a.pmw.options.serverUrl+this.vjImages[b]+'"/>'),$("#vjing-gallery").find(".slides").append(c)}},sendClip:function(){var b;$("#vjing-gallery .slides").find("li").each(function(){$(this).hasClass("active")&&(b=$(this).find("img").attr("src"))}),$.ajax({url:a.pmw.options.serverUrl+"/vjing",type:"post",data:{clip:b}}).done(function(){$("#send").css("pointer-events","none"),$("#send").addClass("disabled"),setTimeout(function(){$("#send").css("pointer-events","all"),$("#send").removeClass("disabled")},2e3)})},resizeCanvas:function(){var a=window.innerHeight?window.innerHeight:$(window).height(),b=($(window).width(),$(".toolbarview").height()+$(".tools").height());a-=b,$("#vjing-gallery").height(a)},gotoPage:function(a){pmw.navigate({route:"/"+a})}})}(this);