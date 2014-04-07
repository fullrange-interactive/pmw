slides = [];
windowModels = [];
function createCanvas (that, windowModel, data){
	var columnsMasksList = new Array();
	var rowsMasksList = new Array();
	var nColumns = windowModel.cols.length;
	var nRows = windowModel.rows.length;
	for(var x = 0; x < nColumns; x++){
	    columnsMasksList.push(false);
	}
	for(var y = 0; y < nRows; y++){
	    rowsMasksList.push(false);
	}
	$(that).height($(that).width()/windowModel.ratio);
	$(that).parent(".renderer_wrapper").height($(that).height());
	$(that).parent(".viewer_wrapper").height($(that).height());
	var grid = new rElemGrid(
	                        windowModel.cols.length,
	                        windowModel.rows.length,
	                        windowModel.ratio,
	                        $(that).width()/$(that).height(),
	                        windowModel.cols,
	                        windowModel.rows,
	                        columnsMasksList,
	                        rowsMasksList,
	                       new Array()
	);
	$(that).empty();
	$(that).append(grid.getDOM());
	grid.dom = that;
	//var mask = $('<div class="mask-image">');
	//$(this).append(mask);
	//grids[$(this).attr('id')].newRelem(0,0,1,1,'Color','front',{color:"FF0000"})
	for(var i in data.relems){
	    //if ( $(that).hasClass("simulation") )
	    //    data.relems[i].data.noscroll = true;
		data.relems[i].data.light = true;
	    grid.newRelem(data.relems[i].x,data.relems[i].y,data.relems[i].width,data.relems[i].height,data.relems[i].type,data.relems[i].z,data.relems[i].data);
	}
	$("video").each(function (){
		$(this).removeAttr('autoplay');
	});
}

function createCanvasForWrapper (){
	var that = this;
	if ( !slides[$(this).attr('id')] ){
    	$.getJSON("/slide",{id:$(this).attr('id')},function (data){
			if ( data ){
				slides[data._id] = data;
				if ( !windowModels[data.windowModel]){
					$.getJSON("/windowModel",{id:data.windowModel}, function (windowModel){
						windowModels[windowModel._id] = windowModel;
						createCanvas(that,windowModel,data);
					});
				}else{
					createCanvas(that,windowModels[data.windowModel],data);
				}
			}
		});
    }else{
		var slide = slides[$(this).attr('id')];
    	createCanvas(that,windowModels[slide.windowModel],slide)
    }
}

$(document).ready(function(){
    var grids = new Object();
	$(".action_button").each(function (){
		var that = this;
		$(this).click(function (){
			
			var windowId = $(this).attr('window-id');
			var action = $(this).attr('window-action');
			$.get('/monitoring',{windowId:windowId,apply:action}, function(res){
				if ( res != 'ok' ){
					alert("error applying action, result=" + res);
				}
			});
		})
	});
    $(".renderer_canvas").each(createCanvasForWrapper);
	$(window).resize(function (){
		console.log("resize")
		$(".renderer_canvas").each(createCanvasForWrapper);
	})
	$(".window.thumbnail").droppable({
		accept:'.thumbnail.sequence, .thumbnail.slide',
		hoverClass:'window-hovered',
		drop: function (event, ui){
            if( $(ui.draggable).attr("sequence-id") ){
			    window.location.replace("/?window="+$(this).attr("window-id")+"&sequence="+$(ui.draggable).attr("sequence-id"));
            }else if ( $(ui.draggable).attr("slide-id") ){
                window.location.replace("/?window="+$(this).attr("window-id")+"&slide="+$(ui.draggable).attr("slide-id"));
            }
		}
	});
	$(".slide.thumbnail").draggable({
		revert: 'invalid',
		revertDuration: 200,
		opacity: 0.5,
		helper: 'clone',
		zIndex:100000000
	});
	$(".sequence.thumbnail").draggable({
		revert: 'invalid',
		revertDuration: 200,
		opacity: 0.5,
		helper: 'clone',
		zIndex:100000000
	});
});