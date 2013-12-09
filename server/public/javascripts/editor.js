/*
 * Window physical propreties
 */
 /*
var gridWidth               = 9;
var gridHeight              = 6;

var windowGlobalWidth       = 175;
var windowGlobalHeight      = 92;

var topBottomSeparator      = 16;

var rowSeparator            = 3.81;
var columnSeparator         = 3.8;

var subTopWindowHeight      = 16.1;
var subWindowHeight         = 28;
var subWindowWidth          = 31.6;
*/

/***---------------------------***/
/*
var subWindowWidthRatio     = subWindowWidth                /windowGlobalWidth;
var columnSeparatorRatio    = columnSeparator               /windowGlobalWidth;

var topRowHeightRatio       = subTopWindowHeight            /windowGlobalHeight;
var rowSeparatorRatio       = rowSeparator                  /windowGlobalHeight;
var subWindowHeightRatio    = subWindowHeight               /windowGlobalHeight;
var topBottomSeparatorRatio = topBottomSeparator           /windowGlobalHeight;
*/
var mainGrid                = false;

var selectedRelem = null;

var slideId = null;

function selectRelem(relem){
    for(var i in mainGrid.getAllRelems())
        if ( mainGrid.getAllRelems()[i] != relem )
            mainGrid.getAllRelems()[i].setSelected(false);
    if ( relem != null ){
        relem.setSelected(true);
        $("#properties").fadeIn(300);
        $("#relemProperties").empty();
        $("#gallery").hide();
        $("#video").hide();
        relem.showProperties($("#relemProperties"));
    }else{
        $("#properties").fadeOut(300);
        $("#fileUpload").fadeOut(300);
    }
    selectedRelem = relem;
}

function moveRelem(x,y){
    var oldRelem = selectedRelem;
    var newItem = mainGrid.newRelem(x,y,selectedRelem.gridWidth,selectedRelem.gridHeight,selectedRelem.type,oldRelem.zIndex,oldRelem.data);
    if( newItem!=false ){
        selectedRelem = newItem;
        mainGrid.removeRelem(oldRelem);
        displayAllLayers();
        selectRelem(selectedRelem);   
    }
}

function resizeRelem(width,height){
    var oldRelem = selectedRelem;
    var newItem = mainGrid.newRelem(oldRelem.gridX,oldRelem.gridY,width,height,selectedRelem.type,oldRelem.zIndex,oldRelem.data);
    if( newItem!=false ){
        selectedRelem = newItem;
        mainGrid.removeRelem(oldRelem);
        displayAllLayers();
        selectRelem(selectedRelem);   
    }
}

function redrawRelem(){
    mainGrid.removeRelem(selectedRelem);
    var oldRelem = selectedRelem;
    selectedRelem = mainGrid.newRelem(selectedRelem.gridX,selectedRelem.gridY,selectedRelem.gridWidth,selectedRelem.gridHeight,selectedRelem.type,oldRelem.zIndex,oldRelem.data);
    selectedRelem.setSelected(true);
    displayAllLayers();
}

function sendToBack(){
    mainGrid.removeRelem(selectedRelem);
    var oldRelem = selectedRelem;
    selectedRelem = mainGrid.newRelem(selectedRelem.gridX,selectedRelem.gridY,selectedRelem.gridWidth,selectedRelem.gridHeight,selectedRelem.type,'back',oldRelem.data);
    selectedRelem.setSelected(true);
}

function sendToFront(){
    mainGrid.removeRelem(selectedRelem);
    var oldRelem = selectedRelem;
    selectedRelem = mainGrid.newRelem(selectedRelem.gridX,selectedRelem.gridY,selectedRelem.gridWidth,selectedRelem.gridHeight,selectedRelem.type,'front',oldRelem.data);
    selectedRelem.setSelected(true);    
}

function sortLayersByZindex(layer1, layer2) {
    var layer1Zindex = layer1.zIndex;
    var layer2Zindex = layer2.zIndex; 
    return ((layer1Zindex > layer2Zindex) ? -1 : ((layer1Zindex < layer2Zindex) ? 1 : 0));
}

function setNewZindex (layers) {
    var zindexVal = 99 + layers.length;
    var layersDiv = $('#layer div');
    for ( var nbrLayer = 0; nbrLayer < layers.length; nbrLayer++ ) {
        var id = $(layersDiv[nbrLayer]).attr('rElemID');

        var layer = mainGrid.getRelem(id);
        mainGrid.removeRelem(layer)
        var newLayer = mainGrid.newRelem(layer.gridX, layer.gridY, layer.gridWidth, layer.gridHeight, layer.type, zindexVal, layer.data);

        zindexVal = zindexVal - 1;
        newLayer.setSelected(false); 
        selectedRelem = null;
     }

    displayAllLayers();
}

// Display layers
function displayAllLayers () {
    var layers = mainGrid.getAllRelems();
    var current = this;

    layers.sort(sortLayersByZindex);
    $('#layer').html('');
    $(layers).each( function (index, layer) {
        $('#layer').append(layer.displayLayer($("#" + layer.instanceName)));
    });

    $('#layer').sortable({
        axis:"y",
        cursor:"move",
        start: function ( event, ui ) {
            console.log('start');
            console.log(ui.item[0].attributes['rElemID'].value);
            var layer = mainGrid.getRelem(ui.item[0].attributes['rElemID'].value);
            if ( layer ) {
                selectedRelem = layer;
                selectedRelem.setSelected(true);
            }

        },
        stop: function ( event, ui ) {
            if ( selectedRelem )
                current.setNewZindex(layers);  
        }
    });


    $('#layer div').on('mouseover', function () {
        var layer = mainGrid.getRelem($(this).attr('relemid'));
        if ( layer ) {
            layer.setSelected(true);   
        }
    });
    
    $('#layer div').on('mouseout', function () {
        var layer = mainGrid.getRelem($(this).attr('relemid'));
        if ( layer ) {
            layer.setSelected(false);   
        }
    });
    
    $('#layer div').on('click', function () {
        var layer = mainGrid.getRelem($(this).attr('relemid'));
        if ( layer ) {
            selectRelem(layer);   
        }
    });
}

$("#newColor").click(function(){
    selectRelem(mainGrid.newRelem(0,0,1,1,'Color','front',{color:"FF0000",opacity:100}));
    displayAllLayers();
})
$("#newCountdown").click(function(){
    selectRelem(mainGrid.newRelem(0,0,2,1,'Counter','front',{date:(new Date(0,0,0,20).getTime()),color:'FFFFFF'}));
    displayAllLayers();
});
$("#newImage").click(function(){
    selectRelem(mainGrid.newRelem(0,0,1,1,'StaticImage','front',{url:"http://server.pimp-my-wall.ch/gallery/logo_estarock.png",displayMode:"cover"}));
    displayAllLayers();
});
$("#newVideo").click(function(){
    selectRelem(mainGrid.newRelem(0,0,2,5,'Video','front',{flipped:false, url:"http://server.pimp-my-wall.ch/videos/Test2.mp4"}));
    displayAllLayers();
});
$("#newMarquee").click(function(){
    selectRelem(mainGrid.newRelem(0,0,2,1,'Marquee','front',{text:"",flipped:false,speed:2,color:"FFFFFF",shadowColor:"000000",shadowDistance:3,font:'Champagne'}));
    displayAllLayers();
});
$("#newText").click(function(){
    selectRelem(mainGrid.newRelem(0,0,2,1,'StaticText','front',{text:"",flipped:false,color:"FFFFFF",font:'Champagne'}));
    displayAllLayers();
});
$("#newDrawing").click(function(){
    selectRelem(mainGrid.newRelem(0,0,2,5,'Drawing','front',{timeout:30}));
    displayAllLayers();
});
$("#newDate").click(function(){
    selectRelem(mainGrid.newRelem(0,0,2,1,'DateDisplayer','front',{color:'00000',font:'Helvetica'}));
});
$("#newTime").click(function(){
    selectRelem(mainGrid.newRelem(0,0,2,1,'TimeDisplayer','front',{color:'00000',font:'Helvetica'}));
});


$(document.body).keydown(function(e){
    var keycode =  e.keyCode ? e.keyCode : e.which;
    if( (keycode == 8 || keycode == 46) && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)){ // backspace

        mainGrid.removeRelem(selectedRelem);
        selectRelem(null); 
        return false;
    }
});

$("#sendToFront").click(function(){
    sendToFront();
});
$("#sendToBack").click(function(){
    sendToBack();
});
$("#save").click(function(){
    $("#modalWindow").fadeIn(100);
    $("#fileName").focus();
    $("#cancelSave").click(function(){$("#modalWindow").fadeOut(100)});
});  

var hoveredCell = null;
var draggedRelem = null;
var stopAnim = false;
var offset = {x:0,y:0};
function startDrag(relem,e){
    draggedRelem = relem;
    $(relem).addClass("dragged");
    $("#editorWindow").addClass("dragged");
    if ( e ){
        var gridCell = mainGrid.getGridXY(e.pageX,e.pageY);
        offset.x = gridCell.gridX-selectedRelem.gridX;
        offset.y = gridCell.gridY-selectedRelem.gridY;
    }
}

function stopDrag(){
    $(draggedRelem).removeClass("dragged");
    $("#editorWindow").removeClass("dragged");
    draggedRelem = null;
}

var resizedRelem = null;
function startResizeSE(relem){
    $(document.body).addClass("resizeCornerSE");
    resizedRelem = relem;
}
function stopResize(relem){
    $(document.body).removeClass("resizeCornerSE");
    resizedRelem = null;
}

$("#editorWrapper").mousedown(function(event){
    selectRelem(null);
})

$(document).mousemove(function(event){
    var e = event;
    //this
    if(draggedRelem != null){
        var gridCell = mainGrid.getGridXY(e.pageX,e.pageY);
        if(gridCell == null || mainGrid.isMaskCell(gridCell.pageX,gridCell.pageY))
            return false;
        if ( !(gridCell.gridX-offset.x == selectedRelem.gridX && gridCell.gridY-offset.y == selectedRelem.gridY) ){
            if ( !mainGrid.isValid(gridCell.gridX-offset.x,gridCell.gridY-offset.y,selectedRelem.gridWidth,selectedRelem.gridHeight) )
                return;
            if ( !stopAnim ){
                moveRelem(gridCell.gridX-offset.x,gridCell.gridY-offset.y);
                draggedRelem = selectedRelem.viewPort;
            }
            return;
        }
    }
    if(resizedRelem != null){
        $(".gridCell").each(function(){
            if(!$(this).hasClass("mask"))
                if (   e.pageX > $(this).offset().left 
                    && e.pageX < $(this).offset().left + $(this).width() 
                    && e.pageY > $(this).offset().top
                    && e.pageY < $(this).offset().top + $(this).height() 
                    ){
                        if ( !(selectedRelem.gridWidth == this.gridX-selectedRelem.gridX+1 && selectedRelem.gridHeight == this.gridY-selectedRelem.gridY+1) ){
                            var cell = this;
                            if ( !mainGrid.isValid(
                                                selectedRelem.gridX,
                                                selectedRelem.gridY,
                                                this.gridX-offset.x-selectedRelem.gridX+1,
                                                this.gridY-offset.y-selectedRelem.gridY+1) )
                                return;
                            resizeRelem(this.gridX-offset.x-selectedRelem.gridX+1,this.gridY-selectedRelem.gridY+1);
                            resizedRelem = selectedRelem.viewPort;
                        }
                }
        });
    }
        //$("#debug").html(hoveredCell.id);
});

$(document).mouseup(function(){
    stopDrag();
    stopResize();
})

$("#saveForm").submit(function(){
        var sendData = {relems:new Array(),createNew:true,name:$("#fileName").val()};
        var allRelems = mainGrid.getAllRelems();
        for(var i in allRelems){
            var relem = allRelems[i];
            var newRelem = new Object();
            newRelem.x = relem.gridX;
            newRelem.y = relem.gridY;
            newRelem.width = relem.gridWidth;
            newRelem.height = relem.gridHeight;
            newRelem.type = relem.type;
            newRelem.data = relem.data;
            newRelem.z = relem.zIndex;
            sendData.relems.push(newRelem);
        }
        if ( slideId != null ){
            sendData.createNew = false;
            sendData.edit = true;
            sendData.id = slideId;
        }
        $.post("/create",sendData,function(data){
            if(data == "ok"){
                window.location.href = "/";
                return false;
            }else{
                alert(data);
            }
        });
        return false;
    });

/*
Here, we add new methods to rElem that are only used for the editor
*/
rElem = rElem.extend({
    selected:false,
    displayLayer: function (dom) {
    },
    loadParent:function(callback){
        this.load(callback);
        $(this.viewPort).mouseover(function(){
            if ( draggedRelem == null && resizedRelem == null )
                $(this).addClass('rElemHover');
        })
        $(this.viewPort).mouseout(function(){
            if ( draggedRelem == null && resizedRelem == null )
                $(this).removeClass('rElemHover');
        })
        this.viewPort.rElem = this;
        var rElemObject = this;
        $(this.viewPort).disableSelection();
        
        $(this.viewPort).mousedown(function(e){
            selectRelem(rElemObject);
            if ( $(this).hasClass("resizeCornerSE") ){
                startResizeSE(this);
                return false;
            }
            startDrag(this,e);
            return false;
        });
        $(this.viewPort).mouseup(function(){
            stopDrag();
        });
        $(this.viewPort).mousemove(function(e){
            var margin = 20;
            var p = $(this);
            var vp = $(this).offset();
            var w = $(this).width();
            var h = $(this).height();
            if ( e.pageX > vp.left + w - margin && e.pageY > vp.top + h - margin && rElemObject.type != 'Counter' ){
                p.addClass("resizeCornerSE");
            }else{
                p.removeClass("resizeCornerSE");
            }
            /*
            if ( e.pageX < vp.left + margin && e.pageY > vp.top + h - margin ){
                p.addClass("resizeCornerSW");
            }else{
                p.removeClass("resizeCornerSW");
            }
            if ( e.pageX > vp.left + w - margin && e.pageY < vp.top + margin ){
                p.addClass("resizeCornerNE");
            }else{
                p.removeClass("resizeCornerNE");
            }
            if ( e.pageX < vp.left + margin && e.pageY < vp.top + margin ){
                p.addClass("resizeCornerNW");
            }else{
                p.removeClass("resizeCornerNW");
            }
            */
        })
    },
    setSelected: function(value){
        this.selected = value;
        if ( value )
            $(this.viewPort).addClass('rElemSelected');
        else
            $(this.viewPort).removeClass('rElemSelected');
    },
    showProperties:function(dom){},
    serialize:function(){
        var retVal = {
            x: this.gridX,
            y: this.gridY,
            width: this.gridWidth,
            height: this.gridHeight,
            type: this.type,
            data: this.data
        };
        return JSON.stringify(retVal);
    }
})

var galleryImages = [];
var galleryVideos = [];

$(document).ready(function(){
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
    mainGrid = new rElemGrid(
                            nColumns,
                            nRows,           
                            1366.0/768.0,
                            $("#editorWindow").width()/$("#editorWindow").height(),
                            columnsList,
                            rowsList,
                            columnsMasksList,
                            rowsMasksList,
                           new Array()
    );
     
    $('#editorWindow').append(mainGrid.getDOM());
    mainGrid.dom = $("#editorWindow").get();
    //var mask = $('<div class="mask-image">');
    //$('#editorWindow').append(mask);
    //test1 = mainGrid.newRelem(0,0,5,5,'Snowfall','replace',{});
    //mainGrid.newRelem(1,1,3,1,'Counter','front',{date:(new Date(2013,09,24,18).getTime()/1000)});
    //mainGrid.newRelem(1,2,3,1,'Counter','front',{date:(new Date(2013,09,24,18).getTime()/1000)});
    if( $_GET.id ){
        $.getJSON("/slide",{id:$_GET.id},function(data){
            for(var i in data.relems){
                mainGrid.newRelem(data.relems[i].x,data.relems[i].y,data.relems[i].width,data.relems[i].height,data.relems[i].type,data.relems[i].z,data.relems[i].data);
                $("#fileName").val(data.name);
                slideId = data._id;
            }
            // Get layers 
            displayAllLayers();
        });
    }

    setInterval(function (){
        // TODO make class getAllMedia and create two array one for videos and one for pictures
        $.getJSON("/getAllMedia?media=images",{},function(data){
            for(var i in data){
                var found = false;
                for(var j in galleryImages){
                    if ( galleryImages[j] == data[i] ){
                        found = true;
                        break;
                    }
                }
                if ( !found ){
                    var newImage = $("<img>").attr('src',"http://server.pimp-my-wall.ch"+data[i]);
                    newImage.click(function(){
                        $("#gallery > img").removeClass("selectedImage");
                        $(this).addClass("selectedImage");
                        $("#imageURL").val($(this).attr('src'));
                        $("#imageURL").trigger("change");
                    })
                    $("#gallery").append(newImage);
                    galleryImages.push(data[i]);
                }
            }
        });

         $.getJSON("/getAllMedia?media=videos",{},function(data){
            for(var i in data){
                var found = false;
                for(var j in galleryVideos){
                    if ( galleryVideos[j] == data[i] ){
                        found = true;
                        break;
                    }
                }
                if ( !found ){
                    var newVideo = $('<video>').attr({'src':"http://server.pimp-my-wall.ch"+data[i]});
                    newVideo.click(function(){
                        $("#video > video").removeClass("selectedVideo");
                        $(this).addClass("selectedVideo");
                        $("#videoURL").val($(this).attr('src'));
                        $("#videoURL").trigger("change");
                    })
                    $("#video").append(newVideo);
                    galleryVideos.push(data[i]);
                }
            }
        });
    },2000);
});

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