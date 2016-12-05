window.IS_IN_ADMIN = true;
var DRAWING_STEPS = 50;

var Class = function() {
    this.initialize && this.initialize.apply(this, arguments);
};
Class.extend = function(childPrototype) { // defining a static method 'extend'
    var parent = this;
    var child = function() { // the child constructor is a call to its parent's
        return parent.apply(this, arguments);
    };
    child.extend = parent.extend; // adding the extend method to the child class
    var Surrogate = function() {}; // surrogate "trick" as seen previously
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;
    for(var key in childPrototype){
        child.prototype[key] = childPrototype[key];
    }
    return child; // returning the child class
};

var ModerateDrawing = Class.extend({
    isReady:false,
    type:'Drawing',
    timeout: 30,
    load:function(callback){
        var that = this;
        this.timeout = this.data.timeout;
        this.drawAt = 0;
        this.draw(that,callback);
    },
    draw: function (that,callback){
        //console.log("draw");
        var that = that;
        var url = "";
        if ( that.data.id != undefined )
            url = '/drawing/?id='+that.data.id;
        else
            url = '/drawing/?rand'+Math.floor(Math.random()*10000)

        $.get(url,{},function (drawing){
            that.drawing = drawing;
            that.drawAt = 0;
            $(that.viewPort).empty();
            that.canvas = $("<canvas></canvas>");
            console.log(drawing);

            /* Canvas must fit in wrapper */
            var imgFormat       = drawing.width/drawing.height;
            var containerFormat = $(that.viewPort).width()/$(that.viewPort).height();            
            var scale = 1;

            /* If container is more landscape, constraint height */
            if(containerFormat > imgFormat)
            {
                scale = $(that.viewPort).height() / drawing.height;
                
                that.canvas[0].height = $(that.viewPort).height();
                that.canvas[0].width = drawing.width * scale;
            }
            else
            {
                scale = $(that.viewPort).width() / drawing.width;
                
                that.canvas[0].width = $(that.viewPort).width();
                that.canvas[0].height = drawing.height * scale; 
            }
            
            that.scaleRatio = scale * drawing.width;

            /* FIXME: We assume cover mode here, can be drawn in fit mode too */
            // if(imgFormat > containerFormat) // The image is more landscape
            // {
                that.offsetX            = 0;
                that.offsetY            = 0;
            //     that.scaleRatio         = $(that.viewPort).width()/drawing.width;
            //     that.offsetY            = ($(that.viewPort).height()-drawing.height*that.scaleRatio)/2;
            // }
            // else // The image is more portrait
            // {
            //     that.offsetY         = 0;
            //     that.scaleRatio     = $(that.viewPort).height()/drawing.height;
            //     that.offsetX        = ($(that.viewPort).width()-drawing.width*that.scaleRatio)/2;
            // }
            
            if ( that.drawAt == 0 )
                that.canvas.clearCanvas();
            if ( that.drawing.backgroundColor != null && that.drawAt == 0 ){
                that.canvas.drawRect({
                    fillStyle:drawing.backgroundColor,
                    x:0,
                    y:0,
                    width: 2000,
                    height: 2000
                });
            }else if ( that.drawing.backgroundImage ){
            	that.canvas.css({
            		backgroundImage:"url('" + that.drawing.backgroundImage + "')",
                    backgroundColor:'none',
					backgroundSize: 'cover',
					backgroundPosition: '50% 50%'
            	});
            }
            that.doPeriodicInterval = setInterval(function (){
                that.doPeriodicDraw(that);
            },100);
            $(that.viewPort).append(that.canvas);
            $(that.viewPort).css({
                height: that.canvas.height() + 'px'
            });
            callback();
        },'json');
    },
    doPeriodicDraw: function (that){
        var rx = that.canvas.width();
        var ry = that.canvas.height();
        console.log(that.scaleRatio);
        for (var n = 0; n < DRAWING_STEPS; n++) {
            for(i = that.drawAt; i < that.drawAt+1 && i < that.drawing.strokes.length; i++ ){
                for(j = 0; j < Math.max(that.drawing.strokes[i].points.length-1, 1); j++ ){
                    var x2;
                    var y2;
                    if (that.drawing.strokes[i].points.length === 1) {
                        x2 = that.drawing.strokes[i].points[j].x*rx+that.offsetX + .1;
                        y2 = that.drawing.strokes[i].points[j].y*ry+that.offsetY + .1;
                    } else {
                        x2 = that.drawing.strokes[i].points[j+1].x*rx+that.offsetX;
                        y2 = that.drawing.strokes[i].points[j+1].y*ry+that.offsetY;
                    }
                    that.canvas.drawLine({
                        strokeStyle:that.drawing.strokes[i].color,
                        strokeWidth:that.drawing.strokes[i].lineWidth * that.scaleRatio,
                        x1: that.drawing.strokes[i].points[j].x*rx+that.offsetX, 
                        y1: that.drawing.strokes[i].points[j].y*ry+that.offsetY,
                        x2: that.drawing.strokes[i].points[j+1].x*rx+that.offsetX,
                        y2: that.drawing.strokes[i].points[j+1].y*ry+that.offsetY,
                        rounded:true
                    });
                }
            }
            that.drawAt += 1;
            if ( that.drawAt >= that.drawing.strokes.length ) {
                clearInterval(that.doPeriodicInterval);
                return;
            }
        }
    },
    cleanup: function (){
        clearInterval(this.interval);
    }
});

var shown = []

$(document).ready(function (){
    $(".drawing").each(function (){
        $(this).bind('inview',function (event, visible, x, y){
            if ( !visible )
                return;
            var that = this;
            if ( shown.indexOf($(that).attr('id')) != -1 )
                return;
            shown.push($(that).attr('id'));
            $.getJSON("/drawing",{id:$(this).attr('id')},function(data){
                var drawing = new ModerateDrawing();
                drawing.viewPort = that;
                drawing.data = {id:$(that).attr('id')};
                drawing.load(function (){});
            });
        });
    });
    setInterval(function (){
        updateList();
    }, 1000)
    $(document).scroll();
});

function inViewDrawing(event, visible, x, y){
    if ( !visible )
        return;
    var that = this;
    if ( shown.indexOf($(that).attr('id')) != -1 )
        return;
    shown.push($(that).attr('id'));
    $.getJSON("/drawing",{id:$(this).attr('id')},function(data){
        var drawing = new ModerateDrawing();
        drawing.viewPort = that;
        drawing.data = {id:$(that).attr('id')};
        drawing.load(function (){});
    });
}

var amountPerPage = 50;

function updateList()
{
    if ( $(".drawing").length >= amountPerPage ){
        return;
    }
    $.get("/moderate",{
        show: (typeof($_GET['show'])=='undefined')?('new'):$_GET['show'],
        ajax: true
    }, function (drawings){
        var stillThere = {};
        for(var i = 0; i < drawings.length; i++){
            var drawing = drawings[i];
            if ( i >= amountPerPage ){
                break;
            }
            stillThere[drawing._id] = true;
            if( $("#" + drawing._id + "_row").length ){
                //Do nothing
            }else{
                console.log(drawing);

                var newBox = $("<div>").addClass("moderateRow row").attr("id",drawing._id + "_row");
                newBox.html('<div class="col-sm-7"><div id="' + drawing._id + '" class="drawing"><canvas></canvas></div></div><div class="col-sm-5 actions"><div class="btn-group"><a href="javascript:moderateDrawing(true,\'' + drawing._id + '\')" class="btn btn-lg btn-success"><span class="glyphicon glyphicon-ok"></span></a><a href="javascript:moderateDrawing(false,\'' + drawing._id + '\')" class="btn btn-lg btn-danger"><span class="glyphicon glyphicon-remove"></span></a></div> <div class="btn-group"><a href="javascript:likeDrawing(1,\'' + drawing._id + '\')" class="btn btn-lg btn-primary"><i class="glyphicon glyphicon-thumbs-up"></i></a><a href="javascript:likeDrawing(-1,\'' + drawing._id + '\')" class="btn btn-lg btn-default"><i class="glyphicon glyphicon-thumbs-down"></i></a><span class="btn btn-default btn-lg"><span id="' + drawing._id + '_likes"> 0</span></span><span class="id-drawing">' + drawing._id + '</span></div>');
                newBox.find(".drawing").bind('inview',function (event, visible, x, y){
                    if ( !visible )
                        return;
                    var that = this;
                    if ( shown.indexOf($(that).attr('id')) != -1 )
                        return;
                    shown.push($(that).attr('id'));
                    $.getJSON("/drawing",{id:$(this).attr('id')},function(data){
                        var drawing = new ModerateDrawing();
                        drawing.viewPort = that;
                        drawing.data = {id:$(that).attr('id')};
                        drawing.load(function (){});
                    });
                });
                $("#drawingsContainer").prepend(newBox);
            }
        }
        var allRows = $(".moderateRow");
        for(var i = 0; i < allRows.length; i++){
            var row = allRows[i];
            if(!stillThere[$(row).attr("id").replace("_row","")]){
                $(row).remove();
            }
        }
    }, 'json');
}


function getQueryParams(qs) {
    qs = qs.split("+").join(" ");
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }

    return params;
}

var $_GET = getQueryParams(document.location.search);

function moderateDrawing(valid,id)
{
    var validate = (valid===true)?1:0;
    var refuse = (valid===false)?1:0;
    var the_id = id;
    $.get('/moderate',{id:id,moderate:1,validate:validate,refuse:refuse}, function(data){
        if ( data != 'ok' )
            alert("error moderating :(");
        else
            $("#"+the_id+'_row').css('display','none')
    });
}

function deleteDrawing(valid,id)
{
    var validate = (valid===true)?1:0;
    var refuse = (valid===false)?1:0;
    var the_id = id;
    $.get('/moderate',{id:id,moderate:1,delete:1}, function(data){
        if ( data != 'ok' )
            alert("error deleting :(");
        else
            $("#"+the_id+'_row').css('display','none')
    });
}


function likeDrawing(like,id)
{
    var the_id = id;
    var the_like = like;
    $.get('/moderate',{id:id,moderate:1,like:like}, function(data){
		var newVal = (parseInt($('#'+the_id+'_likes').html())+the_like);
        if ( data != 'ok' )
            alert("error liking :(");
        else
            $('#'+the_id+'_likes').html(' '+((newVal>0)?'+':'')+newVal);
    });
}