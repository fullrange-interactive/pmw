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
var Configuration = {};
$.ajax({
    url: '/config',
    success: function (res){
        Configuration = res;
    },
    async: false
});

var selectedRelem = null;

var slideId = null;
var oldSelected = null;

var windowModel = null;

var globalColor = '#f00'

var slideWidth = 1;
var slideHeight = 1;

function selectRelem(relem){
    for(var i in mainGrid.getAllRelems())
        if ( mainGrid.getAllRelems()[i] != relem )
            mainGrid.getAllRelems()[i].setSelected(false);
    if ( relem != null ){
        displayAllLayers();
        relem.setSelected(true);
        $("#properties").fadeIn(300);
        $("#relemProperties").empty();
        $("#gallery").hide();
        $("#video").hide();
        oldSelected = relem;
        relem.showProperties($("#relemProperties"));
        showGlobalProperties(relem);
        var relem = relem;
        $("#layer > div").each(function (){   
            var layer = mainGrid.getRelem($(this).attr('relemid'));
            if ( layer == relem ) {
                $("#layer div").removeClass("selected");
                $(this).addClass("selected");
            }
        });
    }else{
        $("#properties").fadeOut(300);
        $("#fileUpload").fadeOut(300);
        showGlobalProperties(null);
    }
    selectedRelem = relem;
}

function showGlobalProperties(relem)
{
    var visible = {
        color: $("#color"),
        shadowColor: $("#shadow-color"),
        font: $("#font")
    }
    if ( relem == null ){
        $("#global-properties").fadeOut(200);
        return;
    }else{
        $("#global-properties").fadeIn(200);
    }
    if ( relem.data.color ){
        visible.color.fadeIn(200);
        visible.color.find(".color-box").css('background-color',"#"+relem.data.color)
    }else{
        visible.color.fadeOut(200);
    }
    if ( relem.data.shadowColor ){
        visible.shadowColor.fadeIn(200);
        visible.shadowColor.find(".color-box").css('background-color',"#"+relem.data.shadowColor)
    }else{
        visible.shadowColor.fadeOut(200);
    }
    if ( relem.data.font ){
        visible.font.fadeIn(200);
        visible.font.find(".font-box").css("font-family",relem.data.font);
        visible.font.find(".font-box").html(relem.data.font);
    }else{
        visible.font.fadeOut(200);
    }
}

function moveRelem(x,y){
    var oldRelem = selectedRelem;
    var newItem = mainGrid.newRelem(x,y,selectedRelem.gridWidth,selectedRelem.gridHeight,selectedRelem.type,oldRelem.zIndex,oldRelem.data);
    newItem.locked = oldRelem.locked;
    if( newItem != false ){
        selectedRelem = newItem;
        mainGrid.removeRelem(oldRelem);
        displayAllLayers();
        selectRelem(selectedRelem);   
    }
}

function resizeRelem(width,height){
    var oldRelem = selectedRelem;
    var newItem = mainGrid.newRelem(oldRelem.gridX,oldRelem.gridY,width,height,selectedRelem.type,oldRelem.zIndex,oldRelem.data);
    newItem.locked = oldRelem.locked;
    if( newItem!=false ){
        if ( !newItem.locked )
            selectedRelem = newItem;
        mainGrid.removeRelem(oldRelem);
        displayAllLayers();
        selectRelem(selectedRelem);   
    }
}

function moveAndResizeRelem(x,y,width,height){
    var oldRelem = selectedRelem;
    var newItem = mainGrid.newRelem(x,y,width,height,selectedRelem.type,oldRelem.zIndex,oldRelem.data);
    newItem.locked = oldRelem.locked;
    if( newItem!=false ){
        if ( !newItem.locked )
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
    selectedRelem.locked = oldRelem.locked;
    selectedRelem.setSelected(true);
    if ( selectedRelem.locked ){
        selectedRelem = null;
    }
    displayAllLayers();
}

function sendToBack(){
    mainGrid.removeRelem(selectedRelem);
    var oldRelem = selectedRelem;
    selectedRelem = mainGrid.newRelem(selectedRelem.gridX,selectedRelem.gridY,selectedRelem.gridWidth,selectedRelem.gridHeight,selectedRelem.type,'back',oldRelem.data);
    selectedRelem.locked = oldRelem.locked;
    selectedRelem.setSelected(true);
}

function sendToFront(relemArg){
    console.log(relemArg)
    var relem = (relemArg)?relemArg:selectedRelem;
    mainGrid.removeRelem(relem);
    var oldRelem = relem;
    var newRelem = mainGrid.newRelem(relem.gridX,relem.gridY,relem.gridWidth,relem.gridHeight,relem.type,'front',oldRelem.data);
    newRelem.locked = oldRelem.locked;
    if ( !newRelem.locked ){
        selectedRelem = newRelem;
        selectedRelem.setSelected(true);    
    }
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
        newLayer.locked = layer.locked;
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
        var layerDiv = $(layer.displayLayer($("#" + layer.instanceName)));
        if ( layer.locked ){
            $(layer.viewPort).css("pointer-events","none");
            $(layer.viewPort).css("opacity",0.7);
            layerDiv.addClass("locked");
            layerDiv.append($('<i class="glyphicon glyphicon-lock" data-toggle="tooltip" title="Ce calque est un masque. Vous pouvez mettre des éléments en-dessus mais pas l\'effacer."></i>'));
        }else{
            layerDiv.append($('<i class="glyphicon glyphicon-trash"></i>'));
            layerDiv.find(".glyphicon-trash").click(function (){
                mainGrid.removeRelem(selectedRelem);
                displayAllLayers();
                selectRelem(null); 
            });
        }
        $('#layer').append(layerDiv);
    });

    $('#layer').sortable({
        axis:"y",
        cursor:"move",
        start: function ( event, ui ) {
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
        if ( layer && !layer.locked ) {
            selectRelem(layer);
        }
    });
}

$("#newColor").click(function(){
    selectRelem(newRelemConsiderMask(0,0,1,1,'Color','front',{color:"FF0000",opacity:100}));
})
// $("#newCountdown").click(function(){
//     selectRelem(newRelemConsiderMask(0,0,3,1,'Counter','front',{date:(new Date(0,0,0,20).getTime()),color:'FFFFFF'}));
//     displayAllLayers();
// });
$("#newImage").click(function(){
    selectRelem(newRelemConsiderMask(0,0,1,1,'StaticImage','front',{url:"http://" + Configuration.url + Configuration.defaultImage,displayMode:"fit"}));
    displayAllLayers();
});
$("#newVideo").click(function(){
    selectRelem(newRelemConsiderMask(0,0,2,5,'Video','front',{flipped:false, url:"http://" + Configuration.url + Configuration.defaultVideo }));
    displayAllLayers();
});
$("#newMarquee").click(function(){
    selectRelem(newRelemConsiderMask(0,0,2,1,'Marquee','front',{text:"",flipped:false,speed:2,color:"FFFFFF",shadowColor:"000000",shadowDistance:3,font:'Helvetica'}));
    displayAllLayers();
});
$("#newText").click(function(){
    selectRelem(newRelemConsiderMask(0,0,2,1,'StaticText','front',{text:"",flipped:false,color:"FFFFFF",font:'Helvetica',padding:10}));
    displayAllLayers();
});
// $("#newDrawing").click(function(){
//     selectRelem(newRelemConsiderMask(0,0,2,5,'Drawing','front',{type:'random',timeout:30}));
//     displayAllLayers();
// });
$("#newDate").click(function(){
    selectRelem(newRelemConsiderMask(0,0,2,1,'DateDisplayer','front',{color:'ffffff',font:'Helvetica'}));
});
$("#newTime").click(function(){
    selectRelem(newRelemConsiderMask(0,0,2,1,'TimeDisplayer','front',{color:'ffffff',font:'Helvetica'}));
});
$("#newMultiText").click(function(){
    selectRelem(newRelemConsiderMask(0,0,2,1,'MultiText','front',{texts:[{text:'',duration:60}],flipped:false,color:"FFFFFF",font:'Helvetica',padding:10}));
});
// $("#newTimeSync").click(function (){
//     selectRelem(newRelemConsiderMask(0,0,1,1,'TimeSync','front',{color:'FFFFFF'}));
// })
// $("#newBall").click(function (){
//     selectRelem(newRelemConsiderMask(0,0,1,1,'Ball','front',{}));
// })
// $("#newFlash").click(function (){
//     selectRelem(newRelemConsiderMask(0,0,1,1,'Flash','front',{color:'FFFFFF',duration:1000}));
// })
// $("#newStrobe").click(function (){
//     selectRelem(newRelemConsiderMask(0,0,1,1,'Strobe','front',{color:'FFFFFF',shadowColor:'000000',speed:200}));
// })
// $("#newParticles").click(function (){
//     selectRelem(newRelemConsiderMask(0,0,1,1,'Particles','front',{color:'FFFFFF',shadowColor:'000000',rate:200}));
// })
// $("#newFireworks").click(function (){
//     selectRelem(newRelemConsiderMask(0,0,1,1,'Fireworks','front',{dummy:true}));
// })
// $("#newDrawingLive").click(function (){
//     selectRelem(newRelemConsiderMask(0,0,1,1,'DrawingLive','front',{dummy:true}));
// })

function newRelemConsiderMask(x,y,width,height,type,location,data){
    var allRelems = mainGrid.getAllRelems();
    var newRelem = mainGrid.newRelem(x,y,width,height,type,location,data);
    for ( var i in allRelems ){
        if ( allRelems[i].locked ){
            sendToFront(allRelems[i]);
        }
    }
    displayAllLayers();
    return newRelem;
}

$(document.body).keydown(function(e){
    var keycode =  e.keyCode ? e.keyCode : e.which;
    if( (keycode == 8 || keycode == 46) && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)){ // backspace
        mainGrid.removeRelem(selectedRelem);
        displayAllLayers();
        selectRelem(null); 
        return false;
    }
    if ( (keycode == 27) )
    {
        $("#editorWrapper").removeClass("fullScreen");
        var allRelems = mainGrid.getAllRelems();
        openSlide.relems = [];
        for(var i in allRelems){
            var relem = allRelems[i];
            var newRelem = {type:relem.type,data:relem.data,locked:relem.locked}
            newRelem.x = relem.gridX;
            newRelem.y = relem.gridY;
            newRelem.width = relem.gridWidth;
            newRelem.height = relem.gridHeight;
            openSlide.relems.push(newRelem);
        }
        repaint(openSlide,windowModel,false)
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

$("#cancelCreate").click(function (){
    window.location.href = "/"
    return false;
});

$("#fullScreen").click(function(){
    $("#editorWrapper").addClass("fullScreen");
    var allRelems = mainGrid.getAllRelems();
    openSlide.relems = [];
    for(var i in allRelems){
        var relem = allRelems[i];
        var newRelem = {type:relem.type,data:relem.data,locked:relem.locked}
        newRelem.x = relem.gridX;
        newRelem.y = relem.gridY;
        newRelem.width = relem.gridWidth;
        newRelem.height = relem.gridHeight;
        openSlide.relems.push(newRelem);
    }
    repaint(openSlide,windowModel,false)
})

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
var resizeDirection = null;
function startResizeSE(relem){
    resizeDirection = 'SE';
    $(document.body).addClass("resizeCornerSE");
    resizedRelem = relem;
}
function startResizeNW(relem){
    resizeDirection = 'NW';
    $(document.body).addClass("resizeCornerNW");
    resizedRelem = relem;
}
function startResizeNE(relem){
    resizeDirection = 'NE';
    $(document.body).addClass("resizeCornerNE");
    resizedRelem = relem;
}
function startResizeSW(relem){
    resizeDirection = 'SW';
    $(document.body).addClass("resizeCornerSW");
    resizedRelem = relem;
}

function startResizeN(relem){
    resizeDirection = 'N';
    $(document.body).addClass("resizeCornerN");
    resizedRelem = relem;   
}
function startResizeS(relem){
    resizeDirection = 'S';
    $(document.body).addClass("resizeCornerS");
    resizedRelem = relem;   
}
function startResizeE(relem){
    resizeDirection = 'E';
    $(document.body).addClass("resizeCornerE");
    resizedRelem = relem;   
}
function startResizeW(relem){
    resizeDirection = 'W';
    $(document.body).addClass("resizeCornerW");
    resizedRelem = relem;   
}

function stopResize(relem){
    resizeDirection = null;
    $(document.body).removeClass("resizeCornerSE");
    $(document.body).removeClass("resizeCornerNW");
    $(document.body).removeClass("resizeCornerNE");
    $(document.body).removeClass("resizeCornerSW");
    $(document.body).removeClass("resizeCornerN");
    $(document.body).removeClass("resizeCornerS");
    $(document.body).removeClass("resizeCornerE");
    $(document.body).removeClass("resizeCornerW");
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
        if(gridCell == null || mainGrid.isMaskCell(gridCell.pageX,gridCell.pageY))
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
            if(!$(this).hasClass("mask")){
                if (   e.pageX > $(this).offset().left 
                    && e.pageX < $(this).offset().left + $(this).width() 
                    && e.pageY > $(this).offset().top
                    && e.pageY < $(this).offset().top + $(this).height() 
                    ){
                        var mouseX = this.gridX;
                        var mouseY = this.gridY;
                        var newX = selectedRelem.gridX;
                        var newY = selectedRelem.gridY;
                        var newW = selectedRelem.gridWidth;
                        var newH = selectedRelem.gridHeight;
                        if ( resizeDirection == 'SE' ){
                            newW = mouseX - selectedRelem.gridX + 1;
                            newH = mouseY - selectedRelem.gridY + 1;                           
                        }else if ( resizeDirection == 'NW' ){
                            newX = mouseX;
                            newY = mouseY;
                            newW = selectedRelem.gridWidth + selectedRelem.gridX - mouseX;
                            newH = selectedRelem.gridHeight + selectedRelem.gridY - mouseY;
                        }else if ( resizeDirection == 'SW' ){
                            newX = mouseX;
                            newW = selectedRelem.gridWidth + selectedRelem.gridX - mouseX;
                            newH = mouseY - newY + 1;
                        }
                        else if ( resizeDirection == 'NE' ){
                            newY = mouseY;
                            newH = selectedRelem.gridHeight + selectedRelem.gridY - mouseY;
                            newW = mouseX - selectedRelem.gridX + 1;
                        }else if ( resizeDirection == 'N' ){
                            newY = mouseY;
                            newH = selectedRelem.gridHeight + selectedRelem.gridY - mouseY;
                        }else if ( resizeDirection == 'S' ){
                            newH = mouseY - newY + 1;
                        }else if ( resizeDirection == 'E' ){
                            newW = mouseX - selectedRelem.gridX + 1;
                        }else if ( resizeDirection == 'W' ){
                            newX = mouseX;
                            newW = selectedRelem.gridWidth + selectedRelem.gridX - mouseX;
                        }
                        if ( !(selectedRelem.gridWidth == newW && selectedRelem.gridHeight == newH && selectedRelem.gridX == newX && selectedRelem.gridY == newY) ){
                            var cell = this;
                            if ( !mainGrid.isValid(
                                                newX,
                                                newY,
                                                newW,
                                                newH) ){
                                return;
                            }
                            moveAndResizeRelem(newX,newY,newW,newH);
                            resizedRelem = selectedRelem.viewPort;
                        }
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
        var sendData = {relems:new Array(),createNew:true,name:$("#fileName").val(),windowModel:windowModel._id,folder:$("#folder").val()};
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
            newRelem.locked = relem.locked;
            sendData.relems.push(newRelem);
        }
        sendData.width = slideWidth;
        sendData.height = slideHeight;
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
            }else if ( $(this).hasClass("resizeCornerNW") ){
                startResizeNW(this);
                return false;
            }else if ( $(this).hasClass("resizeCornerSW") ){
                startResizeSW(this);
                return false;
            }else if ( $(this).hasClass("resizeCornerNE") ){
                startResizeNE(this);
                return false;
            }else if ( $(this).hasClass("resizeCornerN") ){
                startResizeN(this);
                return false;
            }else if ( $(this).hasClass("resizeCornerS") ){
                startResizeS(this);
                return false;
            }else if ( $(this).hasClass("resizeCornerE") ){
                startResizeE(this);
                return false;
            }else if ( $(this).hasClass("resizeCornerW") ){
                startResizeW(this);
                return false;
            }
            startDrag(this,e);
            return false;
        });
        $(this.viewPort).mouseup(function(){
            stopDrag();
        });
        $(this.viewPort).mousemove(function(e){
            var margin = 10;
            var p = $(this);
            var vp = $(this).offset();
            var w = $(this).width();
            var h = $(this).height();
            p.removeClass("resizeCornerN");
            p.removeClass("resizeCornerS");
            p.removeClass("resizeCornerE");
            p.removeClass("resizeCornerW");
            p.removeClass("resizeCornerSE");
            p.removeClass("resizeCornerSW");
            p.removeClass("resizeCornerNE");
            p.removeClass("resizeCornerNW");
            if ( e.pageX > vp.left + w - margin && e.pageY > vp.top + h - margin ){
                p.addClass("resizeCornerSE");
            }else if ( e.pageX < vp.left + margin && e.pageY > vp.top + h - margin ){
                p.addClass("resizeCornerSW");
            }else if ( e.pageX > vp.left + w - margin && e.pageY < vp.top + margin ){
                p.addClass("resizeCornerNE");
            }else if ( e.pageX < vp.left + margin && e.pageY < vp.top + margin ){
                p.addClass("resizeCornerNW");
            }else if ( e.pageY < vp.top + margin ){
                p.addClass("resizeCornerN");
            }else if ( e.pageY > vp.top + h - margin ){
                p.addClass("resizeCornerS");
            }else if ( e.pageX > vp.left + w - margin ){
                p.addClass("resizeCornerE");
            }else if ( e.pageX < vp.left + margin  ){
                p.addClass("resizeCornerW");
            }
        })
    },
    setSelected: function(value){
        if ( this.locked ){
            return;
        }
            
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

openSlide = {};

$(document).ready(function(){
    var dropZone = new Dropzone(document.body,{
        url:'/upload',
        previewsContainer: "#previews", // Define the container to display the previews
        clickable: "#previews", // Define the element that should be used as click trigger to select files.
        acceptedFiles: 'image/*,video/*,application/pdf'
    });
    dropZone.on('dragenter',function (){
        $("#dropIndicator").css("display",'block');
    });
    dropZone.on('drop', function (){
        $("#dropIndicator").css("display",'none');
        $("#previews").fadeIn(200);
    });
    dropZone.on('complete',function (file){
        dropZone.removeAllFiles();
        $("#previews").fadeOut(200);
        if ( !file.accepted )
            return;
        if ( file.type.match(/image\/.+/) || file.type === 'application/pdf' ){
            // Create a new image relem
            selectRelem(newRelemConsiderMask(0,0,1,1,'StaticImage','front',{url:"http://" + Configuration.url + '/' + file.xhr.responseText, displayMode:"fit"}));
        } else if ( file.type.match(/video\/.+/) ){
            selectRelem(newRelemConsiderMask(0,0,1,1,'Video','front',{flipped:false, url:"http://" + Configuration.url + '/' + file.xhr.responseText}));
        }
    });
    dropZone.on('error',function (){
        //dropZone.removeAllFiles();
        //$("#previews").fadeOut(200);
    });
    if( $_GET.id ){
        $("#windowModelChooser").hide();
        $.getJSON("/slide", {id:$_GET.id}, function (data){
            openSlide = data;
            $.getJSON("/windowModel",{id:data.windowModel}, function (wm){
                windowModel = wm;
                var rows = windowModel.rows;
                var cols = windowModel.cols;
                var newRows = []
                var newCols = [];
                var width = openSlide.width;
                var height = openSlide.height;
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
                repaint(null,windowModel,true);
                repaint(openSlide,windowModel);
                // Get layers 
                displayAllLayers();
            })
        });
    } else {
        //Get all window models because we are creating a new slide
        $("#create").click(function (){
            var modelId = $("#windowModel").val();
            var width = $("#slideWidth").val();
            var height = $("#slideHeight").val();
            $.getJSON('/windowModel',{id:modelId},function (wm){
                windowModel = wm;
                var rows = windowModel.rows;
                var cols = windowModel.cols;
                var newRows = []
                var newCols = [];
                var sum = 0;
                for ( var y = 0; y < height; y++ ){
                    for ( var gridY = 0; gridY < rows.length; gridY++ ){
                        newRows.push(rows[gridY]/height);
                        sum += rows[gridY]/height;
                    }
                }
                for ( var x = 0; x < width; x++ ){
                    for ( var gridX = 0; gridX < cols.length; gridX++ ){
                        newCols.push(cols[gridX]/width);
                    }
                }
                console.log(newRows);
                console.log("sum = " + sum)
                windowModel.width = width;
                windowModel.height = height;
                windowModel.rows = newRows;
                windowModel.cols = newCols;
                windowModel.ratio *= width/height;
                slideWidth = width;
                slideHeight = height;
                repaint(null,windowModel,true);
                $("#windowModelChooser").fadeOut();
            })
            return false;
        });
    }
    updateGallery();
    $(window).resize(function (){
        var allRelems = mainGrid.getAllRelems();
        openSlide.relems = [];
        for(var i in allRelems){
            var relem = allRelems[i];
            var newRelem = {type:relem.type,data:relem.data,locked:relem.locked}
            newRelem.x = relem.gridX;
            newRelem.y = relem.gridY;
            newRelem.width = relem.gridWidth;
            newRelem.height = relem.gridHeight;
            newRelem.zIndex = relem.zIndex;
            openSlide.relems.push(newRelem);
        }
        repaint(openSlide,windowModel,false)
    })
    $("#color").pmwColorPicker({
        callback: function (newColor){
            selectedRelem.data.color = newColor;
            $("#color .color-box").css("background-color","#"+newColor);
            $("#color .color-palette-color-box").each(function (){
                if ( $(this).hasClass('selected') && $(this).css("background-color") != "#" + newColor ){
                    $(this).removeClass("selected");
                }
            })
            redrawRelem();
        }
    });
    $("#shadow-color").pmwColorPicker({
        callback: function (newColor){
            console.log(selectedRelem.data.shadowColor + " = ...");
            selectedRelem.data.shadowColor = newColor;
            $("#shadow-color .color-box").css("background-color","#"+newColor);
            $("#shadow-color .color-palette-color-box").each(function (){
                if ( $(this).hasClass('selected') && $(this).css("background-color") != "#" + newColor ){
                    $(this).removeClass("selected");
                }
            });
            redrawRelem();
        }
    })
    $("#font").pmwFontSelector({
        callback: function (newFont){
            console.log(selectedRelem.data.font + " = ...");
            selectedRelem.data.font = newFont;
            $("#font .font-box").css("font-family", newFont);
            $("#font .font-box").html(newFont);
            $("#font .fonts-list-font").each(function (){
                if ( $(this).hasClass('selected') && $(this).css("font-family") != newFont ){
                    $(this).removeClass("selected");
                }
            });
            redrawRelem();
        }
    })
});

function repaint(data, windowModel,doMask){
    initGrid(windowModel.cols,windowModel.rows,windowModel.ratio);
    if ( data ){
        for(var i in data.relems){
            mainGrid.newRelem(data.relems[i].x,data.relems[i].y,data.relems[i].width,data.relems[i].height,data.relems[i].type,(data.relems[i].zIndex)?(data.relems[i].zIndex):(data.relems[i].z),data.relems[i].data).locked = data.relems[i].locked;
            $("#fileName").val(data.name);
            slideId = data._id;
        }
    }
    if ( windowModel.mask && doMask ){
        console.log(windowModel)
        for ( var x = 0; x < windowModel.width; x++ ){
            for ( var y = 0; y < windowModel.height; y++ ){
                console.log("mask")
                mainGrid.newRelem(
                    x*windowModel.cols.length/windowModel.width,
                    y*windowModel.rows.length/windowModel.height,
                    windowModel.cols.length/windowModel.width,
                    windowModel.rows.length/windowModel.height,
                    'StaticImage','front',{url:windowModel.mask,displayMode:"stretch"}).locked = true;
            }
        }
        displayAllLayers();
    }
}

function initGrid(columnsList,rowsList,ratio)
{
    var columnsMasksList = new Array();
    var rowsMasksList = new Array();
    for(var x = 0; x < columnsList.length; x++){
        columnsMasksList.push(false);
    }
    for(var y = 0; y < rowsList.length; y++){
        rowsMasksList.push(false);
    }
    if ( !$("#editorWrapper").hasClass("fullScreen") ){
        width = $("#editorWindow").width();
        height = width / ratio;
        $("#editorWindow").height(height);
    }else{
        width = $("#editorWrapper").width();
        height = width / ratio;
        //$("#editorWindow").width(width);
        $("#editorWindow").height(height);
        console.log((($("#editorWrapper").height()-height)/2)+'px');
        $("#editorWindow").css("top",(($("#editorWrapper").height()-height)/2)+'px');
    }
    mainGrid = new rElemGrid(
                            columnsList.length,
                            rowsList.length,           
                            ratio,
                            width/height,
                            columnsList,
                            rowsList,
                            columnsMasksList,
                            rowsMasksList,
                            new Array()
    );
    $("#editorWindow").empty();
    $('#editorWindow').append(mainGrid.getDOM($('#editorWindow').width(),$('#editorWindow').height()));
    mainGrid.dom = $("#editorWindow").get();
}

function updateGallery(){
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
                    var vidContainer = $('<div class="thumbnail">');
                    var deleteButton = $('<a><i class="glyphicon glyphicon-trash"></i></a>');
                    deleteButton.on('click', function (){
                        var that = this;
                        $.get('/upload', {delete:$(this).parent().find('img').attr('src')}, function (data){
                            if ( data == 'ok' ){
                                $(that).parent().remove();
                            }else{
                                alert(data);
                            }
                        });
                    })
                    var newImage = $("<img>").attr('src',"http://" + Configuration.url + data[i]);
                    vidContainer.click(function(){
                        $("#gallery > .thumbnail").removeClass("selectedImage");
                        $(this).addClass("selectedImage");
                        $("#imageURL").val($(this).find("img").attr('src').split("?")[0]);
                        $("#imageURL").trigger("change");
                    })
                    vidContainer.append(newImage);
                    vidContainer.append(deleteButton);
                    $("#gallery").prepend(vidContainer);
                    //$("#gallery").get().scrollTo(0,0);
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
                    var vidContainer = $('<div class="thumbnail">');
                    var deleteButton = $('<a><i class="glyphicon glyphicon-trash"></i></a>');
                    deleteButton.on('click', function (){
                        var that = this;
                        $.get('/upload', {delete:$(this).parent().find('img').attr('src').split('?')[0]}, function (data){
                            if ( data == 'ok' ){
                                $(that).parent().remove();
                            }else{
                                alert(data);
                            }
                        });
                    })
                    var newVideo = $('<img class="video-emulator">').attr({'src':"http://" + Configuration.url + data[i] + '.png' + '?2#t=2.0'}).append(data[i]);
                    vidContainer.click(function(){
                        $("#video > .thumbnail").removeClass("selectedVideo");
                        $(this).addClass("selectedVideo");
                        $("#videoURL").val($(this).find(".video-emulator").attr('src').replace(".png","").split('?')[0]);
                        $("#videoURL").trigger("change");
                    })
                    vidContainer.append(newVideo)
                    vidContainer.append(deleteButton);
                    $("#video").prepend(vidContainer);
                    //$("#gallery").get().scrollTo(0,0);
                    galleryVideos.push(data[i]);
                }
            }
        });
    },2000);
}