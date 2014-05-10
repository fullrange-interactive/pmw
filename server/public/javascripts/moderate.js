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
            url = 'http://baleinev.ch:443/drawing/?id='+that.data.id;
        else
            url = 'http://baleinev.ch:443/drawing/?rand'+Math.floor(Math.random()*10000)
        $.get(url,{},function (drawing){
            that.drawing = drawing;
            that.drawAt = 0;
            $(that.viewPort).empty();
            that.canvas = $("<canvas></canvas>");
            that.canvas[0].width = $(that.viewPort).width();
            that.canvas[0].height = $(that.viewPort).height();

            var imgFormat       = drawing.width/drawing.height;
            var drawFormat      = $(that.viewPort).width()/$(that.viewPort).height();
            if(imgFormat > drawFormat) // The image is more landscape
            {
                that.offsetX            = 0;
                that.scaleRatio         = $(that.viewPort).width()/drawing.width;
                that.offsetY            = ($(that.viewPort).height()-drawing.height*that.scaleRatio)/2;
            }
            else // The image is more portrait
            {
                that.offsetY         = 0;
                that.scaleRatio          = $(that.viewPort).height()/drawing.height;
                that.offsetX        = ($(that.viewPort).width()-drawing.width*that.scaleRatio)/2;
            }
            
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
            }
            that.doPeriodicInterval = setInterval(function (){
                that.doPeriodicDraw(that);
            },100);
            $(that.viewPort).append(that.canvas);
            callback();
        },'json');
    },
    doPeriodicDraw: function (that){
        for(i = that.drawAt; i < that.drawAt+1 && i < that.drawing.strokes.length; i++ ){
            for(j = 0; j < that.drawing.strokes[i].points.length-1; j++ ){
                that.canvas.drawLine({
					strokeStyle:that.drawing.strokes[i].color,
					strokeWidth:that.drawing.strokes[i].lineWidth*that.scaleRatio,
					x1: that.drawing.strokes[i].points[j].x*that.scaleRatio+that.offsetX, 
					y1: that.drawing.strokes[i].points[j].y*that.scaleRatio+that.offsetY,
					x2: that.drawing.strokes[i].points[j+1].x*that.scaleRatio+that.offsetX,
					y2: that.drawing.strokes[i].points[j+1].y*that.scaleRatio+that.offsetY,
					rounded:true
				});
            }
        }
        that.drawAt += 1;
        if ( that.drawAt >= that.drawing.strokes.length )
            clearInterval(that.doPeriodicInterval);
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
            $.getJSON("http://baleinev.ch:443/drawing",{id:$(this).attr('id')},function(data){
                var drawing = new ModerateDrawing();
                drawing.viewPort = that;
                drawing.data = {id:$(that).attr('id')};
                drawing.load(function (){});
            });
        });
    });
    $(document).scroll();
});

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