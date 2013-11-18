$(document).ready(function(){
    var grids = new Object();
    $(".renderer_canvas").each(function(){
        var grid = new rElemGrid(
                                3,
                                9,           
                                100/84.0,
                                $(this).width()/$(this).height(),
                                new Array(
                                    0.48,
                                    0.04,
                                    0.48),
                                new Array(
                                    0.14,
                                    0.06,
                                    0.16,
                                    0.04,
                                    0.16,
                                    0.04,
                                    0.16,
                                    0.06,
                                    0.18
                                    ),
                               new Array(
                                   false,
                                   true,
                                   false),
                               new Array(
                                   false,
                                   true,
                                   false,
                                   true,
                                   false,
                                   true,
                                   false,
                                   true,
                                   false),
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