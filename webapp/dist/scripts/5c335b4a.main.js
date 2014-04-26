!function(a){"use strict";a.pmw=a.pmw||{},a.pmw.mconfig={name:"pmw",locales:[{locale:"en"}],debugView:NO}}(this),function(a){"use strict";a.pmw=M.Application.extend().create(a.pmw.mconfig),$(document).ready(function(){a.pmw.start({routing:{routes:{"":"menuController",draw:"drawController"},menuController:a.pmw.Controllers.MenuController.create(),drawController:a.pmw.Controllers.DrawController.create()}})})}(this),this.JST=this.JST||{},pmw.Models=pmw.Models||{},function(){"use strict";pmw.Models.TmpviewModel=M.Model.extend({})}(),pmw.Collections=pmw.Collections||{},function(){"use strict";pmw.Collections.TmpviewsCollection=M.Collection.extend({model:pmw.Models.TmpviewModel})}(),pmw.Views=pmw.Views||{},function(){"use strict";pmw.Views.BackheaderView=M.ToolbarView.extend({scopeKey:"pageHeadline"},{first:M.ButtonView.extend({icon:"fa-angle-left",events:{tap:function(){pmw.navigate({route:"/",transition:M.PageTransitions.CONST.MOVE_TO_RIGHT_FROM_LEFT})}}}),second:M.View.extend({useElement:YES,template:'<div class="logo"><img src="images/Logo.png" /></div>'})})}(),pmw.Views=pmw.Views||{},function(){"use strict";pmw.Views.HomeView=M.View.extend({grid:"row"},{menu:M.View.extend({grid:"col-md-12"},{draw:M.ImageView.extend({value:"images/drawing.jpg",events:{tap:function(){this.gotoPage("draw")}}})})})}(),pmw.Views=pmw.Views||{},function(){"use strict";pmw.Views.DrawView=M.View.extend({cssClass:"page-draw",template:'<div id="fb-root"></div>'},{area:M.View.extend({useElement:YES,template:'<div id="contentCanvas"><p style="text-align:center">Loading Canvas...</p></div>'}),tools:M.View.extend({grid:"row",cssClass:"tools toolbarview"},{foregroundColor:M.TextfieldView.extend({grid:"col-xs-2",value:"",cssClass:"colorpicker foreground",type:"text"}),backgroundColor:M.TextfieldView.extend({grid:"col-xs-2",value:"",cssClass:"colorpicker background",type:"text"}),sizeStroke:M.SelectView.extend({grid:"col-xs-2",scopeKey:"selectionSize.size",cssClass:"selectionSize",selectOptions:{collection:[{id:1,name:"small",value:3},{id:2,name:"medium",value:10},{id:3,name:"large",value:20},{id:4,name:"xlarge",value:30}],labelPath:"name",valuePath:"value"},events:{change:"changeSize"}}),undo:M.ButtonView.extend({grid:"col-xs-2 col-sm-2 col-md-2",icon:"fa-undo",value:"",events:{tap:"undo"}}),trash:M.ButtonView.extend({grid:"col-xs-2 col-sm-2 col-md-2",cssClass:"m-error",icon:"fa-trash-o",value:"",events:{tap:"clearDraw"}}),save:M.ButtonView.extend({grid:"col-xs-2 col-sm-2 col-md-2",cssClass:"m-success",icon:"fa-check",value:"",events:{tap:"saveDraw"}})})})}(),pmw.Controllers=pmw.Controllers||{},function(){"use strict";pmw.Controllers.AbstractController=M.Controller.extend({headerView:null,contentView:null,menuView:null,pageHeadline:"",applicationStart:function(a){var b=M.SwitchHeaderContentLayout.extend({}).create(this,null,!0);pmw.setLayout(b),this._initViews(a)},show:function(a){this._initViews(a);var b=M.SwitchHeaderContentLayout.extend({}).create(this,null,!0);b._type===pmw.getLayout()._type?pmw.getLayout().startTransition():this.applicationStart()},applicationReady:function(){},_applyViews:function(){pmw.getLayout().applyViews({header:this.headerView,content:this.contentView})},_initViews:function(){}})}(),pmw.Controllers=pmw.Controllers||{},function(){"use strict";pmw.Controllers.MenuController=pmw.Controllers.AbstractController.extend({tmpViews:null,_initViews:function(){this.contentView||(this.contentView=pmw.Views.HomeView.create(this,null,!0)),this.headerView||(this.headerView=M.ToolbarView.extend({grid:"col-md-12",value:"Pimp My Wall"}).create()),this._applyViews()},gotoPage:function(a){pmw.navigate({route:"/"+a})}})}(),pmw.Controllers=pmw.Controllers||{},function(){"use strict";function a(a,b){localStorage.removeItem("Strokes"),d.push({points:[{x:a,y:b},{x:a+1,y:b+1}],color:g,lineWidth:h}),localStorage.setItem("Strokes",JSON.stringify(d))}var b,c,d,e,f=null,g="#000000",h=10;pmw.Controllers.DrawController=pmw.Controllers.AbstractController.extend({pageHeadline:M.I18N.get("draw.title"),selectionSize:M.Model.create({size:5}),strokesMin:10,palette:[["FFFFFF","FF0000","94c13c","0000FF"],["000000","964B00","07ace2","F57900"],["e5287b","75507B","FCE94F","888888"],["008800"]],backgroundColor:null,myRequestManager:"",_initViews:function(){this.contentView||(this.contentView=pmw.Views.DrawView.create(this,null,!0)),this.headerView||(this.headerView=pmw.Views.BackheaderView.create(this,null,!0)),this._applyViews();var a=this,b=[];for(var c in this.palette)for(var d in this.palette[c])b.push(this.palette[c][d]);localStorage.getItem("Background")||this.setBackgroundColor("#"+b[Math.floor(Math.random()*b.length)]),$(".colorpicker.background input").spectrum({showPaletteOnly:!0,showPalette:!0,color:a.backgroundColor,palette:a.palette,change:function(b){a.setBackgroundColor(b.toHexString()),localStorage.setItem("Background",b.toHexString())}}),$(".colorpicker.foreground input").spectrum({showPaletteOnly:!0,showPalette:!0,color:g,palette:a.palette,change:function(a){g=a.toHexString(),localStorage.setItem("Foreground",a.toHexString())}}),$(".selectionSize .selection-list").sizeChooser(this.changeSize),this.newCanvas(),this.myRequestManager=M.RequestManager.init({baseUrl:"http://jebediah.pimp-my-wall.ch/",method:"POST",timeout:1e4,callbacks:{beforeSend:{action:function(a){a.xhr.setRequestHeader("Accept","application/json"),a.xhr.setRequestHeader("Cache-Control","no-cache")}},error:{action:function(a){console.log("ERROR My Request Manager : "),console.log(a)}}}})},setBackgroundColor:function(a){this.backgroundColor=a,localStorage.setItem("Background",a),$(".colorpicker.background input").spectrum("set",a.replace("#","")),$("#contentCanvas canvas").css("background-color",this.backgroundColor)},newCanvas:function(){e='<canvas id="canvas" width="'+$(window).width()+'" height="'+($(window).height()-$(".toolbarview").height()-$(".tools").height())+'"></canvas>',$("#contentCanvas").html(e),e=$("#contentCanvas canvas")[0],b=$("#contentCanvas canvas")[0].getContext("2d"),window.addEventListener("resize",this.resizeCanvas,!1),window.addEventListener("orientationchange",this.resizeCanvas,!1),this.resizeCanvas(),b.strokeStyle=localStorage.getItem("Foreground")?localStorage.getItem("Foreground"):g,b.lineWidth=h,b.lineCap="round",b.lineJoin="round",this.setBackgroundColor(localStorage.getItem("Background")?localStorage.getItem("Background"):this.backgroundColor),$("#contentCanvas canvas").drawTouch(),$("#contentCanvas canvas").drawPointer(),$("#contentCanvas canvas").drawMouse(),null!=localStorage.getItem("Strokes")?(d=JSON.parse(localStorage.getItem("Strokes")),this.repaint()):d=[]},clearDraw:function(){var a=[];for(var b in this.palette)for(var c in this.palette[b])a.push(this.palette[b][c]);this.setBackgroundColor("#"+a[Math.floor(Math.random()*a.length)]),localStorage.removeItem("Background"),localStorage.removeItem("Strokes"),localStorage.removeItem("Foreground"),this.newCanvas()},changeSize:function(){console.log("ASDASDASDASDASD"),h=$(".selectionSize select").val(),b.lineWidth=h},undo:function(){d.pop(),this.repaint()},saveDraw:function(){if(confirm("Envoyer le dessin?")){var a=d;$.ajax({url:"http://10.192.87.3:443/drawing",data:{action:"newDrawing",strokes:a,width:e.width,height:e.height,backgroundColor:this.backgroundColor},jsonp:"callback",dataType:"jsonp"}).done(function(a){a&&a.responseType?(M.Toast.show("Ton dessin a été envoyé! Nos modérateurs vont y jeter un oeil."),confirm("Share to facebook ?")&&this.shareFacebook()):M.Toast.show("Erreur lors de l'envoi ! :(")})}},shareFacebook:function(){$.ajaxSetup({cache:!0}),$.getScript("//connect.facebook.net/en_UK/all.js",function(){FB.init({appId:"1381340082121397"}),FB.Event.subscribe("auth.authResponseChange",function(a){"connected"===a.status?this.postToWall():("not_authorized"===a.status,FB.login())})})},postToWall:function(){console.log("Post img to wall");var a=e.toDataURL(),b=a.substring(a.indexOf(",")+1,a.length),c=Base64Binary.decode(b),d=this.getFormData2(c,"dessin","PimpMyWall.png");console.log(d),FB.api("/me/photos","POST",{source:d,message:"Mon dessin sur Pimp My Wall"},function(a){console.log("into function"),a&&!a.error?(console.log("uploaded"),console.log(a)):(console.log("some error"),console.log(a.error))})},getFormData2:function(a,b,c){var d="AaB03x",e="",e="Content-Type: multipart/form-data; boundary="+d+"\r\n";e+="--"+d+"\r\n",e+='Content-Disposition: file; name="'+b+'"; filename="'+c+'"\r\n',e+="Content-Type: image/png\r\n",e+="Content-Transfer-Encoding: binary\r\n",e+="\r\n";for(var f=0;f<a.length;++f)e+=String.fromCharCode(255&a[f]);return e+="\r\n",e+="--"+d+"--\r\n"},drawLine:function(a,c,d,e,f,g){b.beginPath(),b.lineCap="round",b.lineJoin="round",b.strokeStyle=a,b.lineWidth=c,b.moveTo(d,e),b.lineTo(f,g),b.stroke(),b.closePath()},resizeCanvas:function(){console.log("resize");var a=1/1.206897,c=window.innerHeight?window.innerHeight:$(window).height(),d=$(window).width(),f=0,g=0,h=$(".toolbarview").height()+$(".tools").height();c-=h,1>d/c?(f=d,g=f*a):(g=c,f=g/a);var i=b.getImageData(0,0,e.width,e.height);e.width=f,e.height=g,$("#contentCanvas").height(c),b.putImageData(i,0,0)},repaint:function(){if(d){b.clearRect(0,0,e.width,e.height);for(var a=0;a<d.length;a++)for(var c=0;c<d[a].points.length-1;c++)this.drawLine(d[a].color,d[a].lineWidth,d[a].points[c].x,d[a].points[c].y,d[a].points[c+1].x,d[a].points[c+1].y)}}}),$.fn.drawTouch=function(){var e=function(d){d=d.originalEvent,b.beginPath(),b.strokeStyle=g,c=d.changedTouches[0].pageX,f=d.changedTouches[0].pageY-44,b.moveTo(c,f),a(c,f),M.Logger.log("new stroke")},h=function(a){a.preventDefault(),a=a.originalEvent,c=a.changedTouches[0].pageX,f=a.changedTouches[0].pageY-44,b.lineTo(c,f),b.stroke(),d[d.length-1].points.push({x:c,y:f})};$(this).on("touchstart",e),$(this).on("touchmove",h)},$.fn.drawPointer=function(){var e=function(d){d=d.originalEvent,b.beginPath(),b.strokeStyle=g,c=d.pageX,f=d.pageY-44,b.moveTo(c,f),a(c,f),M.Logger.log("new stroke")},h=function(a){a.preventDefault(),a=a.originalEvent,c=a.pageX,f=a.pageY-44,b.lineTo(c,f),b.stroke(),d[d.length-1].points.push({x:c,y:f})};$(this).on("MSPointerDown",e),$(this).on("MSPointerMove",h)},$.fn.drawMouse=function(){var e=0,h=function(d){e=1,b.beginPath(),b.strokeStyle=g,c=d.pageX,f=d.pageY-44,b.moveTo(c,f),a(c,f),M.Logger.log("new stroke")},i=function(a){e&&(c=a.pageX,f=a.pageY-44,b.lineTo(c,f),b.stroke(),d[d.length-1].points.push({x:c,y:f}))},j=function(){e=0};$(this).on("mousedown",h),$(this).on("mousemove",i),$(window).on("mouseup",j)}}();