slides = [];
windowModels = [];
grids = [];
function resizeGrid(that, windowModel){
	var columnsMasksList = new Array();
	var rowsMasksList = new Array();
	var nColumns = windowModel.cols.length;
	var nRows = windowModel.rows.length;
	$(that).height($(that).width()/windowModel.ratio);
	$(that).parent(".renderer_wrapper").height($(that).height());
	$(that).parent(".viewer_wrapper").width($(that).width());
	$(that).parent(".viewer_wrapper").height($(that).height());
	$(that).parents(".thumbnail").css("top",($(that).parents(".thumbnail").height()+10)*$(that).attr("window-y"))
	$(that).parents(".thumbnail").css("left",($(that).parents(".thumbnail").width()+10)*$(that).attr("window-x"))
	grid.dom = that;
	if ( $(that).attr("window-id") ){
		grids[$(that).attr("window-id")] = grid;
	}else{
		grids[$(that).attr("slide-id")] = grid;
	}
	//var mask = $('<div class="mask-image">');
	//$(this).append(mask);
	//grids[$(this).attr('id')].newRelem(0,0,1,1,'Color','front',{color:"FF0000"})
}

function createGrid(that, windowModel){
	var columnsMasksList = new Array();
	var rowsMasksList = new Array();
	var nColumns = windowModel.cols.length;
	var nRows = windowModel.rows.length;
	$(that).height($(that).width()/windowModel.ratio);
	$(that).parent(".renderer_wrapper").height($(that).height());
	$(that).parent(".viewer_wrapper").width($(that).width());
	$(that).parent(".viewer_wrapper").height($(that).height());
	$(that).parents(".thumbnail").css("top",($(that).parents(".thumbnail").height()+10)*$(that).attr("window-y"))
	$(that).parents(".thumbnail").css("left",($(that).parents(".thumbnail").width()+10)*$(that).attr("window-x"))
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
	$(that).append(grid.getDOM($(that).width(),$(that).height()));
	grid.dom = that;
	if ( $(that).attr("window-id") ){
		grids[$(that).attr("window-id")] = grid;
	}else{
		grids[$(that).attr("slide-id")] = grid;
	}
	//var mask = $('<div class="mask-image">');
	//$(this).append(mask);
	//grids[$(this).attr('id')].newRelem(0,0,1,1,'Color','front',{color:"FF0000"})
}

function addRelems (grid, data){
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

function getSlideInCache(slideId, callback){
    if ( slides[slideId] ){
        var retSlide = {};
        $.extend(retSlide,slides[slideId]);
        callback(retSlide);
    }else{
        $.getJSON("/slide",{id:slideId},function(slide){
            slides[slide._id] = slide;
            var retSlide = {};
            $.extend(retSlide,slides[slideId]);
            callback(retSlide);
        });
    }
}

function createCanvasForWrapperLight(){
	var that = this;
	var group = $(that).parents(".group");
	$(that).width(group.width()/group.attr("group-width")-10)
	if ( !slides[$(this).attr('id')] ){
		if ( !windowModels[$(that).attr("window-model")]){
			$.getJSON("/windowModel",{id:$(that).attr("window-model")}, function (windowModel){
				if ( $(that).hasClass("window_canvas") ){
					resizeGrid(that,windowModel);
				}else{
					var rows = windowModel.rows;
					var cols = windowModel.cols;
					var newRows = []
					var newCols = [];
					var width = $(that).attr("slide-width");
					var height = $(that).attr("slide-height");
                    
					for ( var y = 0; y < height; y++ ){
						for ( var gridY = 0; gridY < rows.length; gridY++ ){
							newRows.push(rows[gridY]/height);
						}
					}
					for ( var x = 0; x < width; x++ ){
						for ( var gridX = 0; gridX < cols.length; gridX++ ){
							newCols.push(cols[gridX]/width);
						}
					}
                    
					windowModel.width = width;
					windowModel.height = height;
					windowModel.rows = newRows;
					windowModel.cols = newCols;
					windowModel.ratio *= width/height;
					slideWidth = width;
					slideHeight = height;
					resizeGrid(that,windowModel);
				}
			});
		}else{
			resizeGrid(that,windowModels[$(that).attr("window-model")]);
		}
    }else{
		var slide = slides[$(this).attr('id')];
    	resizeGrid(that,windowModels[slide.windowModel])
    }    
}

function createCanvasForWrapper (){
	var that = this;
	var group = $(that).parents(".group");
	$(that).width(group.width()/group.attr("group-width")-10)
	if ( !slides[$(this).attr('id')] ){
		if ( !windowModels[$(that).attr("window-model")]){
			$.getJSON("/windowModel",{id:$(that).attr("window-model")}, function (windowModel){
				if ( $(that).hasClass("window_canvas") ){
					createGrid(that,windowModel);
					if ( $(that).attr("slide-id") ){
						getSlideInCache($(that).attr("slide-id"), function (slide){
							for(var i = 0; i < slide.relems.length; i++ ){
								slide.relems[i].x -= ( parseInt($(that).attr("window-x")) - parseInt($(that).attr("slide-base-x")) )*windowModel.cols.length;
								slide.relems[i].y -= ( parseInt($(that).attr("window-y")) - parseInt($(that).attr("slide-base-y")) )*windowModel.rows.length;
							}
							addRelems(grids[$(that).attr("window-id")],slide);
						});
					}
				}else{
					var rows = windowModel.rows;
					var cols = windowModel.cols;
					var newRows = []
					var newCols = [];
					var width = $(that).attr("slide-width");
					var height = $(that).attr("slide-height");
                    
					for ( var y = 0; y < height; y++ ){
						for ( var gridY = 0; gridY < rows.length; gridY++ ){
							newRows.push(rows[gridY]/height);
						}
					}
					for ( var x = 0; x < width; x++ ){
						for ( var gridX = 0; gridX < cols.length; gridX++ ){
							newCols.push(cols[gridX]/width);
						}
					}
                    
					windowModel.width = width;
					windowModel.height = height;
					windowModel.rows = newRows;
					windowModel.cols = newCols;
					windowModel.ratio *= width/height;
					slideWidth = width;
					slideHeight = height;
					createGrid(that,windowModel);
					getSlideInCache($(that).attr("slide-id"), function (slide){
						addRelems(grids[$(that).attr("slide-id")],slide);
					});
				}
			});
		}else{
			createGrid(that,windowModels[$(that).attr("window-model")]);
		}
    }else{
		var slide = slides[$(this).attr('id')];
    	createGrid(that,windowModels[slide.windowModel])
    }
}

function getWindowByXY(x,y){
	var elem = null;
	$(".window .renderer_canvas").each(function (){
		if ( $(this).attr("window-x") == x && $(this).attr("window-y") == y ){
			elem = $(this).parents(".window");
		}
	});
	return elem;
}

function debouncer( func , timeout ) {
   var timeoutID , timeout = timeout || 200;
   return function () {
      var scope = this , args = arguments;
      clearTimeout( timeoutID );
      timeoutID = setTimeout( function () {
          func.apply( scope , Array.prototype.slice.call( args ) );
      } , timeout );
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
	$(window).resize( debouncer( function (e) {
        // do stuff 
        console.log("resize")
        $(".renderer_canvas").each(createCanvasForWrapperLight);
    }))
	$(".window.thumbnail").droppable({
		accept:'.thumbnail.sequence, .thumbnail.slide',
		over: function (event, ui){
			var myX = parseInt($(this).find(".renderer_canvas").attr("window-x"));
			var myY = parseInt($(this).find(".renderer_canvas").attr("window-y"));
			var w = parseInt($(ui.draggable).attr("slide-width"));
			var h = parseInt($(ui.draggable).attr("slide-height"));
			var valid = true;
			for( var x = myX; (x < myX + w) && valid; x++ ){
				for ( var y = myY; (y < myY + h) && valid; y++ ){
					if ( getWindowByXY(x,y) == null ){
						valid = false;
					}
				}
			}
			for( var x = 0; x < $(this).parents(".group").attr("group-width"); x++ ){
				for ( var y = 0; y < $(this).parents(".group").attr("group-height"); y++ ){
					var win = getWindowByXY(x,y);
					if ( win ){
						if ( x >= myX && x < myX + w && y >= myY && y < myY + h ){
							if ( valid ){
								$(win).removeClass("window-hovered-invalid")
								$(win).addClass("window-hovered-valid")
							}else{
								$(win).removeClass("window-hovered-valid")
								$(win).addClass("window-hovered-invalid")
							}
						}else{
							$(win).removeClass("window-hovered-valid")
							$(win).removeClass("window-hovered-invalid")
						}
					}
				}
			}
		},
		drop: function (event, ui){
			$(".window").removeClass("window-hovered-valid")
			$(".window").removeClass("window-hovered-invalid")
			var myX = parseInt($(this).find(".renderer_canvas").attr("window-x"));
			var myY = parseInt($(this).find(".renderer_canvas").attr("window-y"));
			var w = parseInt($(ui.draggable).attr("slide-width"));
			var h = parseInt($(ui.draggable).attr("slide-height"));
			var valid = true;
			for( var x = myX; (x < myX + w) && valid; x++ ){
				for ( var y = myY; (y < myY + h) && valid; y++ ){
					if ( getWindowByXY(x,y) == null ){
						valid = false;
					}
				}
			}
			if ( valid ){
				window.location.replace(
					"/?group=" 
					+ $(this).parents(".group").attr("group-id") 
					+ "&x=" 
					+ $(this).find(".renderer_canvas").attr("window-x")
					+ "&y="
					+ $(this).find(".renderer_canvas").attr("window-y")
					+ "&slide="
					+ $(ui.draggable).attr("slide-id")
				);
			}
		}
	});
	$(".slide.thumbnail").draggable({
		revert: 'invalid',
		revertDuration: 200,
		opacity: 0.5,
		helper: 'clone',
		zIndex:100000000,
		stop:function (){
			$(".window").removeClass("window-hovered-valid");
			$(".window").removeClass("window-hovered-invalid");
		}
	});
	$(".sequence.thumbnail").draggable({
		revert: 'invalid',
		revertDuration: 200,
		opacity: 0.5,
		helper: 'clone',
		zIndex:100000000
	});
	$("#debug").click(function (){
		$.when($(".debug-info").slideToggle()).then(function (){
			$(window).resize();
		});
		if ( $(this).hasClass("active") ){
			$(this).removeClass("active");
			localStorage.setItem("hideDebug",true)
		}else{
			$(this).addClass("active");
			localStorage.setItem("hideDebug",false)
		}
	});
	if ( localStorage.getItem("hideDebug") == "true" ){
		$(".debug-info").toggle();
		$("#debug").removeClass("active");
	}
});