$(document).ready(function(){
    var grids = new Object();
    $(".renderer_canvas").each(function(){
		var that = this;
        $.getJSON("/slide",{id:$(this).attr('id')},function (data){
			if ( data ){
				$.getJSON("/windowModel",{id:data.windowModel}, function (windowModel){
					console.log(windowModel)
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
			        var grid = new rElemGrid(
			                                windowModel.cols.length,
			                                windowModel.rows.length,           
			                                1366.0/768.0,
			                                $(that).width()/$(that).height(),
			                                windowModel.cols,
			                                windowModel.rows,
			                                columnsMasksList,
			                                rowsMasksList,
			                               new Array()
			        );
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
				});
			}
        });
    });
});