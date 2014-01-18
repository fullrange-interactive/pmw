$(document).ready(function(){
    var grids = new Object();
    $(".renderer_canvas").each(function(){
        var columnsList = [
            0.1,
            0.1,
            0.1,
            0.1,
            0.1,
            0.1,
            0.1,
            0.1,
            0.1,
            0.1];
        var rowsList = [
            0.1,
            0.1,
            0.1,
            0.1,
            0.1,
            0.1,
            0.1,
            0.1,
            0.1,
            0.1];
        var columnsMasksList = new Array();
        var rowsMasksList = new Array();
        var nColumns = 10;
        var nRows = 10;
        for(var x = 0; x < nColumns; x++){
            columnsMasksList.push(false);
        }
        for(var y = 0; y < nRows; y++){
            rowsMasksList.push(false);
        }
        var grid = new rElemGrid(
                                nColumns,
                                nRows,           
                                1366.0/768.0,
                                $(this).width()/$(this).height(),
                                columnsList,
                                rowsList,
                                columnsMasksList,
                                rowsMasksList,
                               new Array()
        );
        $(this).append(grid.getDOM());
        grid.dom = this;
        //var mask = $('<div class="mask-image">');
        //$(this).append(mask);
        var that = this;
        //grids[$(this).attr('id')].newRelem(0,0,1,1,'Color','front',{color:"FF0000"})
        $.getJSON("/slide",{id:$(this).attr('id')},function(data){
          if ( data )
            for(var i in data.relems){
                //if ( $(that).hasClass("simulation") )
                //    data.relems[i].data.noscroll = true;
				data.relems[i].data.light = true;
                grid.newRelem(data.relems[i].x,data.relems[i].y,data.relems[i].width,data.relems[i].height,data.relems[i].type,data.relems[i].z,data.relems[i].data);
            }
			$("video").each(function (){
				$(this).removeAttr('autoplay');
			})
        });
    });
});