var CollectionElement = Class.extend({
	element: null,
	data: {},
	type: 'slide',
	selected: false,
	initialize: function(element){
		this.data = {probability:0.1}
		this.element = element;
	},
	draw: function (collectionDOM, collection){
		var element = $("<div>").addClass("collection-element");
		element.html('<label>' + this.element.name + '</label>');
		var probabilityEditor = $("<div>").addClass("probability-editor");
		var probabilityInput = $('<input type="text"/>');
		probabilityInput.val(this.data.probability)
		probabilityInput.keyup((function (probabilityInput){
			console.log(probabilityInput.val());
			this.data.probability = parseFloat(probabilityInput.val());
		}).bind(this,probabilityInput));
		probabilityEditor.html('<label>Probabilité:</label>')
		probabilityEditor.append(probabilityInput);
		var deleteButton = $("<div>").addClass("btn btn-xs btn-std delete")
		deleteButton.html('<span class="glyphicon glyphicon-trash"></span>');
		deleteButton.click((function(){collection.deleteElement(this);}).bind(this));
		element.append(deleteButton)
		element.append(probabilityEditor)
		collectionDOM.append(element);
	}
});

var Collection = Class.extend({
	collectionElements: [],
	period:1000,
	type: 'random',
	selected: false,
	initialize: function (){
		this.collectionElements = [];
	},
	deleteElement: function(element){
		this.collectionElements.splice(this.collectionElements.indexOf(element),1);
		redraw();
	},
	draw: function (automator){
		var collection = $("<div>").addClass("collection");
		var periodEditor = $("<div>").addClass("period-editor");
		var periodInput = $('<input type="text"/>');
		periodInput.val(this.period);
		periodInput.keyup((function (periodInput2){
			this.period = parseInt(periodInput2.val(),10);
		}).bind(this,periodInput));
		periodEditor.html('<label>Période:</label>');
		periodEditor.append(periodInput);
		collection.append(periodEditor);
		collection.droppable({
			accept:'.slidebox',
			drop: this.droppable.bind(this),
			hoverClass: 'drop-hover'
		})
		
		for(var i = 0; i < this.collectionElements.length; i++){
			this.collectionElements[i].draw(collection,this);
		}
		automator.append(collection);
	},
	droppable: function (e, ui){
		var newElement = new CollectionElement(slides[$(ui.draggable).attr("slide-id")],0.1);
		this.collectionElements.push(newElement);
		redraw();
	}
});


var Automator = Class.extend({
	collections: [],
	draw: function (editor){
		var collectionsContainer = $("<div>").addClass("collections");
		for(var i = 0; i < this.collections.length; i++ ){
			this.collections[i].draw(collectionsContainer);
		}
		editor.empty();
		editor.append(collectionsContainer)
	}
})

var currentWindowModel = null;
var slides = [];
var draggableRelem = null;
var automator = null;

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

$(document).ready(function (){
	var that = this;
	$.getJSON('/windowModel', {getAll:1}, function (windowModels){
		if( windowModels.length != 0 ){
		    if ( !$_GET.id ){
				//Initialiazation
				automator = new Automator();
				redraw();
		    }else{
		        $.getJSON("/automator",{id:$_GET.id,fetch:1},function(data){
					//Load existing automator
					redraw();
		        });
		    }
	
		}else{
			//Show "create window model" page
		}
	})

    $("#save").click(function (){
        $("#modalWindow2").fadeIn(200);
        $("#fileName").focus();
    });
    $("#cancelSave").click(function (){
        $("#modalWindow2").fadeOut(200);
    });
    $("#lengthValue").focus();
    $("#saveForm").submit(function (){
        var sendData = {collections:[],name:$("#fileName").val()};
		sendData.createNew = true;
		sendData.edit = false;
		for(var i = 0; i < automator.collections.length; i++){
			var collection = automator.collections[i];
			var newCollection = {period: collection.period,data:collection.data,collectionElements:[],type:collection.type}
			sendData.collections.push(newCollection);
			for(var j = 0; j < collection.collectionElements.length; j++){
				var collectionElement = collection.collectionElements[j];
				var newCollectionElement = {data: collectionElement.data,type: collectionElement.type, element: collectionElement.element._id}
				newCollection.collectionElements.push(newCollectionElement)
			}
		}
        if ( $_GET.id != null ){
            sendData.createNew = false;
            sendData.edit = true;
            sendData.id = $_GET.id;
        }
		console.log(JSON.stringify(sendData));
        $.post("/automator",JSON.parse(JSON.stringify(sendData)),function(data){
            if(data == "OK"){
                window.location.href = "/";
                return false;
            }else{
                alert(data);
				return false;
            }
        });
        return false;
    });
	$("#refreshSlides").click(function (){
		$("#slideLibrary").slideBrowser(false,3,function (){},"slidebox");
	});

	$("#slideLibrary").slideBrowser(false,3,function (){},"slidebox");
	
	$("#createCollection").click(function (){
		var newCollection = new Collection();
		automator.collections.push(newCollection);
		redraw();
	});
});

function redraw(){
	automator.draw($("#editorWindow"));
}

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
	    grid.newRelem(data.relems[i].x,data.relems[i].y,data.relems[i].width,data.relems[i].height,data.relems[i].type,data.relems[i].z,data.relems[i].data,data.relems[i].locked);
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
	$(that).width(group.width()/group.attr("group-width")-10);
	console.log($(that).attr("window-model"));
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
}
