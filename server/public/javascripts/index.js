$(document).ready(function(){
    var grids = new Object();
    $(".renderer_canvas").each(function(){
        var columnsList = [
            0.02379,
            0.512445,
            0.015277,
            0.01209078,
            0.034937,
            0.0964695,
            0.19637189,
            0.0820841,
            0.021445];
        var rowsList = [
            0.088958,
            0.086350,
            0.065859,
            0.234375,
            0.018971,
            0.042318,
            0.327875,
            0.149579];
        var columnsMasksList = new Array();
        var rowsMasksList = new Array();
        var nColumns = 9;
        var nRows = 8;
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
                grid.newRelem(data.relems[i].x,data.relems[i].y,data.relems[i].width,data.relems[i].height,data.relems[i].type,data.relems[i].z,data.relems[i].data);
            }
        });
    });
});