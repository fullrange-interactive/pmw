var SequenceEvent = Class.extend({
    timeAt: 0,
    slides: [],
    isDrawn: false,
    block: null,
    blockDurationText: null,
    blockNameText: null,
    sequence: null,
    selected: false,
	transition: 'none',
    initialize: function (sequence,timeAt){
        this.sequence = sequence;
        this.timeAt = timeAt;
        this.slides = [];
    },
    setSelected: function(){
        for(i in this.sequence.sequenceEvents ){
            this.sequence.sequenceEvents[i].selected = false;
        }
        $(".eventBlock").each(function (){
            $(this).removeClass("selected");
        });
        this.block.addClass("selected");
        this.selected = true;        
    },
    draw: function (timeLine){
        if ( !this.isDrawn ){
            this.block = $('<div class="eventBlock ui-widget-content"></div>');
            this.blockDurationText = $('<p class="eventBlockDuration">'+secondsToHumanTime(this.timeAt)+'</p>');
            this.block.append(this.blockDurationText);
            //this.blockNameText = $('<p class="eventBlockName">Slide1</p>');
            //this.block.append(this.blockNameText);
            timeLine.append(this.block);
            this.isDrawn = true;
            this.block.click(function (){
                that.setSelected();
            });
            this.block.draggable({
                axis:'x',
                containment:"parent",
                start: function (){
                    that.setSelected();
                },
                drag: function (event, ui){
                    var ui = ui
                    $(".eventBlock:not(.ui-draggable-dragging)").each(function (){                    
                        right = ui.position.left + that.block.width();
                        left = ui.position.left;
                        bright = $(this).position().left + $(this).width();
                        bleft = $(this).position().left;
                    
                        //console.log("r = " + right + " l = " + left + " bl = " + bleft + " br = " + bright)
                        if ( right > bleft && right < bright || ( left < bleft && right > bright ) ){
                            ui.position.left = bleft-that.block.width();
                        } else if ( left < bright && right > bright ){
                            ui.position.left = bright;
                        }
                    });
                },
                stop: function (e,ui){
                    that.timeAt = (ui.position.left/that.sequence.timeLine.width())*that.sequence.duration;
                    that.draw();
					seekTo(mainTimeAt);
                }
            });
			
			var transitionsList = $('<ul>').addClass("list-unstyled").css("z-index",9999999999);
			for ( var i in transitions ){
				var extra = "";
				if ( transitions[i] == this.transition ){
					extra = '<span class="glyphicon glyphicon-ok" style="display:inline-block;margin-left:-15px;margin-right:3px"></span>';
				}
				var option = $('<li><a class="btn btn-xs">' + extra + transitions[i] + "</a></li>").css("z-index",9999999999);
				option.data("sequenceEvent",this);
				option.data("transition",transitions[i]);
				option.data("block",$(this.block));
				transitionsList.append(option);
				option.on('click',function (ev){
					var that = this;
					$(this).data("sequenceEvent").transition = $(this).data("transition");
					$(this).parent().find("li").each(function (){
						if ( $(that).data("sequenceEvent").transition == $(this).data("transition") ){
							$(this).find("a").prepend($('<span class="glyphicon glyphicon-ok"></span> ').css({
								display:'inline-block',
								marginLeft:'-15px',
								marginRight:'3px'
							}));
						}else{
							$(this).find(".glyphicon").remove();
						}
					});
					$(this).data("block").popover("hide");
				});
			}
			
			$(this.block).popover({
				animation: true,
				html: true,
				placement: 'left',
				content: transitionsList
			});
			/*
            this.block.resizable({
                handles:'e,w',
                containment:"parent",
                start: function (){
                    that.setSelected();
                },
                resize: function (e, ui){
                    var ui = ui
                    var e = e;
                    $(".eventBlock:not(.ui-resizable-resizing)").each(function (){                    
                        right = ui.position.left + ui.size.width;
                        left = ui.position.left;
                        bright = $(this).position().left + $(this).width();
                        bleft = $(this).position().left;
                        //console.log(ui.helper);
                        //console.log("r = " + right + " l = " + left + " bl = " + bleft + " br = " + bright)
                        if ( right > bleft && right < bright && left < bleft ){
                            that.block.css({width:bleft-ui.position.left+'px'});
                        } else if ( left < bright && right > bleft ){
                            that.block.css({left:bright+'px',width:(right-bright)+'px'});
                            ui.position.left = bright;
                        }
                    });
                },
                stop: function (e, ui){
                    that.duration = ($(this).width()/that.sequence.timeLine.width())*that.sequence.duration;
                    that.timeAt = (ui.position.left/that.sequence.timeLine.width())*that.sequence.duration;
                    that.draw();
					seekTo(mainTimeAt);
                }
            });
			*/
        }
        //this.block.css("width",this.duration/this.sequence.duration*100 + "%");
        this.block.css("left",this.timeAt/this.sequence.duration*100 + "%");
        this.blockDurationText.html(secondsToHumanTime(this.timeAt));
        //this.blockNameText.html(this.slide.name);
        var that = this;
    }
});

function secondsToHumanTime(seconds) {
    var retString = "";
    if ( seconds >= 60 ){
        if ( seconds >= 60*60 ){
            retString += Math.floor(seconds/3600) + "h ";
            seconds %= 3600;
        }
        retString += (Math.floor(seconds/60)!=0)?(Math.round(seconds/60) + "m"):'';
        seconds %= 60;
    }
    retString += (Math.floor(seconds)!=0)?(Math.round(seconds*100)/100 + "s"):'';
    return retString;
}

var Sequence = Class.extend({
    isDrawn: false,
    domObject: null,
    sequenceEvents: [],
    duration: 0,
    timeLine: null,
	width: 1,
	height: 1,
	windowModel: null,
	music: null,
	soundInstance: null,
    initialize: function (domObject,duration,width,height,windowModel){
		console.log("HEy");
        this.duration = duration;
        this.domObject = domObject;
		this.width = width;
		this.height = height;
		this.windowModel = windowModel;
    },
	addMusic: function(music){
		this.music = music;
		var audioPath = "/";
		var manifest = [
		    {id:"music", src:music+".ogg"}
		];
		createjs.Sound.alternateExtensions = ["mp3"];
		if (!createjs.Sound.initializeDefaultPlugins()) { alert("can not play sound on this browser :("); return; }
		createjs.Sound.addEventListener("fileload", this.musicLoaded);
		createjs.Sound.registerManifest(manifest, audioPath);
		console.log("starting load...")
	},
	musicLoaded: function(event){
		console.log("LOADED!");
		console.log(event)
		mainSequence.soundInstance = createjs.Sound.play(event.src);
		mainSequence.soundInstance.pause();
		mainSequence.domObject.addClass("music");
	},
	eventAt: function (seconds){
		if ( this.sequenceEvents.length == 0 ){
			return null;
		}
		for ( i in this.sequenceEvents ){
			ev = this.sequenceEvents[i];
			if ( ev.timeAt <= seconds && (ev.timeAt + ev.duration) > seconds ){
				return ev;
			}
		}
		var latest = this.sequenceEvents[0];
		for ( i in this.sequenceEvents ){
			ev = this.sequenceEvents[i];
			if ( ev.timeAt <= seconds && latest.timeAt < ev.timeAt ){
				latest = ev;
			}
		}
		return latest;
	},
    draw: function (){
        if ( !this.isDrawn ){
            this.timeAxis = $('<div class="timeAxis">');
            this.domObject.append(this.timeAxis);
            steps = 12;
            smallSteps = 2;
            for ( axisAt = 0; axisAt < this.duration; axisAt += this.duration/steps ){
                label = $('<span class="axisLabel">');
                label.html('<p>'+secondsToHumanTime(axisAt)+'</p>');
                label.css("left",axisAt/this.duration*100 + "%");
                this.timeAxis.append(label);
                for ( offset = this.duration/steps/smallSteps; offset < this.duration/steps; offset += this.duration/steps/smallSteps ){
                    label = $('<span class="axisLabel axisLabel-small">');
                    label.html('<p>'+secondsToHumanTime(axisAt+offset)+'</p>');
                    label.css("left",(axisAt+offset)/this.duration*100 + "%");
                    this.timeAxis.append(label);
                }
            }
            this.timeLine = $('<div class="timeline">');
            var that = this;
			$("#editorWindow .gridCell").droppable({
				accept:".slidebox",
				drop: function(e, ui){
					var x = Math.floor($(this).attr('grid-x') / currentWindowModel.cols.length * currentWindowModel.width );
					var y = Math.floor($(this).attr('grid-y') / currentWindowModel.rows.length * currentWindowModel.height );
					var ncols = currentWindowModel.cols.length / currentWindowModel.width;
					var nrows = currentWindowModel.rows.length / currentWindowModel.height;
					var slide = slides[$(ui.draggable).attr("slide-id")];
                    
                    var toDelete = [];
                    
                    for ( var i in currentEvent.slides ){
                        var slide2 = currentEvent.slides[i];
                        console.log(slide.win)
                        if (
                            x + slide.width > slide2.winX
                            &&
                            x < slide2.winX + slide2.slide.width
                            &&
                            y + slide.height > slide2.winY  
                            &&
                            y < slide2.winY + slide2.slide.height
                            ){
                                toDelete.push(slide2);
                        }
                    }                    
                    
                    currentEvent.slides = currentEvent.slides.filter(function (s){
                        if ( toDelete.indexOf(s) != -1 ){
                            return false;
                        }
                        return true;
                    });
                    
                    currentEvent.slides.push({winX:x,winY:y,slide:slide});
					
					mainGrid.removeRelem(draggableRelem);
                    
                    seekTo(mainTimeAt,false,true);
					
				},
				over: function(e, ui){
					var x = Math.floor($(this).attr('grid-x') / currentWindowModel.cols.length * currentWindowModel.width );
					var y = Math.floor($(this).attr('grid-y') / currentWindowModel.rows.length * currentWindowModel.height );
					if ( !slides[$(ui.draggable).attr("slide-id")] ){
						$.getJSON('/slide',{id:$(ui.draggable).attr("slide-id")}, function (slide){
							slides[$(ui.draggable).attr("slide-id")] = slide;
							mainGrid.removeRelem(draggableRelem);
							var ncols = currentWindowModel.cols.length / currentWindowModel.width;
							var nrows = currentWindowModel.rows.length / currentWindowModel.height;
							var w = ncols * slide.width;
							var h = nrows * slide.height;
							draggableRelem = mainGrid.newRelem(x*ncols,y*nrows,w,h,'Color','front',{color:'#92caff'});
						});
					}else{
						var slide = slides[$(ui.draggable).attr("slide-id")];
						mainGrid.removeRelem(draggableRelem);
						var ncols = currentWindowModel.cols.length / currentWindowModel.width;
						var nrows = currentWindowModel.rows.length / currentWindowModel.height;
						var w = ncols * slide.width;
						var h = nrows * slide.height;
						console.log(w)
						draggableRelem = mainGrid.newRelem(x*ncols,y*nrows,w,h,'Color','front',{color:'#92caff'});
					}
				}
			})
			/*
            this.timeLine.droppable({
                accept:".slidebox",
                drop: function (e, ui){
                    left = ui.position.left-$(this).offset().left;
                    var newEvent = new SequenceEvent(that,(left+$(ui.draggable).width()/2)/$(this).width()*that.duration);
                    that.sequenceEvents.push(newEvent);
                    $.getJSON("/slide",{id:$(ui.draggable).attr('id')},function(data){
                        newEvent.slide = data;
                        newEvent.draw(thamaint.timeLine); 
                        newEvent.setSelected(); 
						seekTo(mainTimeAt);
                    });
                },
                over: function (e, ui){
                    ui.helper.animate({backgroundColor:"rgba(152,184,126,0.6)"},100);
                },
                out: function (e, ui){
                    ui.helper.animate({backgroundColor:"rgba(0,0,0,0.1)"})
                }
            })
			*/
            this.domObject.append(this.timeLine);
            for(var i in this.sequenceEvents){
                this.sequenceEvents[i].draw(this.timeLine);
            }
            this.isDrawn = true;
        }
        this.timeLine.css("width", "100%");
    }
});

var mainSequence = null;
var mainGrid = null;
var mainTimeAt = 0;
var playInterval = null;
var playing = false;
var playSpeed = 1;
var currentWindowModel = null;
var slides = [];
var draggableRelem = null;
var currentEvent = null;

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
var oldSlide = null;
var oldCnt = -1;

function seekTo(seconds, dontMoveScrubber, force)
{
	mainTimeAt = seconds;
	var ev = mainSequence.eventAt(seconds);
    if ( ev != currentEvent || oldCnt != ev.slides.length || force ){
        oldCnt = ev.slides.length;
        currentEvent = ev;
        mainGrid.clearAll();
        for ( var i in currentEvent.slides ){
            var sequenceEventSlide = currentEvent.slides[i];
            var id = sequenceEventSlide.slide._id;
            var slide = slides[id];
    		var ncols = currentWindowModel.cols.length / currentWindowModel.width;
    		var nrows = currentWindowModel.rows.length / currentWindowModel.height;
	
    		for(var i = 0; i < slide.relems.length; i++ ){
    			var relem = slide.relems[i];
    			//console.log(relem);
    			var rx = relem.x + sequenceEventSlide.winX * ncols;
    			var ry = relem.y + sequenceEventSlide.winY * nrows;
    			//console.log("--" + x + " " + y) 
    			mainGrid.newRelem(rx,ry,relem.width,relem.height,relem.type,relem.z,relem.data);
    		}
        }
    }
	
	if ( force )
	console.log("force")
	
	if ( mainSequence.soundInstance ){
		if ( !playing ){
			mainSequence.soundInstance.setPosition(seconds*1000);
			//mainSequence.soundInstance.play(0,seconds*1000);
		}
	}
    
    
	if ( dontMoveScrubber != true ){
		$("#scrubber").css({left:seconds/mainSequence.duration*mainSequence.timeLine.width()+'px'});
	}
}

var playStart = null;

function play(force){
	if ( !playing || force ){
		playing = true;
		playSpeed = 1;
		playStart = (new Date()).getTime() - mainTimeAt*1000;
		//console.log(mainSequence);
		if ( mainSequence.music )
			mainSequence.soundInstance.play();
		$("#play> i").removeClass('icon-play');
		$("#play > i").addClass('icon-pause');
	}else{
		playing = false;
		clearInterval(playInterval);
		playInterval = null;
		playStart = null;
		if ( mainSequence.music )
			mainSequence.soundInstance.pause();
		$("#play > i").removeClass('icon-pause');
		$("#play > i").addClass('icon-play');
	}
	
	
	
	if ( playInterval == null && playing ){
		playInterval = setInterval(function (){
			if ( playing ){
				mainTimeAt = ((new Date()).getTime() - playStart)/1000;
				if ( mainTimeAt > mainSequence.duration ){
					mainTimeAt = 0;
					playStart = (new Date()).getTime();
				}
				seekTo(mainTimeAt);
			}
		}, 30)
	}
}

function pause(){
	playing = false;
	clearInterval(playInterval);
	playInterval = null;
	$("#play > i").removeClass('icon-pause');
	$("#play > i").addClass('icon-play');
}

function ffwd(){
	playSpeed = 10;
}

function fbwd(){
	playSpeed = -10;
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
	if( !$("#editorWrapper").hasClass("fullScreen") ){
		width = $("#editorWindow").width();
		height = width / ratio;
		if ( height > 500 ){
			height = 500;
			width = 500 * ratio;
			$("#editorWindow").css("width",width);
		}
		$("#editorWindow").height(height);
	}else{
		width = $("#editorWrapper").width();
		height = width / ratio;
		//$("#editorWindow").width(width);
		$("#editorWindow").height(height);
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

function windowModelSingleToMulti(windowModel,width,height){
	var rows = windowModel.rows;
	var cols = windowModel.cols;
	var newRows = []
	var newCols = [];
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
	console.log(windowModel)
	return windowModel;
}

$(document).ready(function (){
	var that = this;
	$.getJSON('/windowModel', {getAll:1}, function (windowModels){
		if( windowModels.length != 0 ){
		    if ( !$_GET.id ){
		        $("#modalWindow").fadeIn(200);
		        $("#okCreate").click(function (){
					var windowModel = null;
					for ( var i in windowModels ){
						if ( windowModels[i]._id == $("#windowModel").val() ){
							windowModel = windowModels[i];
						}
					}
					var w = parseInt($("#sequenceWidth").val());
					var h = parseInt($("#sequenceHeight").val())
					windowModel = windowModelSingleToMulti(windowModel, w, h);
					currentWindowModel = windowModel;					
					initGrid(windowModel.cols,windowModel.rows,windowModel.ratio);
		            mainSequence = new Sequence($("#mainSequence"), parseInt($("#lengthValue").val()) * parseInt($("#lengthUnit").val()), w, h, windowModel);
					var newEvent = new SequenceEvent(mainSequence,0);
                    mainSequence.sequenceEvents.push(newEvent);
                    currentEvent = newEvent;
		            mainSequence.draw();
                    if ( $("#sequenceMusic").val() ){
                    	mainSequence.addMusic($("#sequenceMusic").val());
                    }
		            $("#modalWindow").fadeOut();
		        });
		    }else{
		        $.getJSON("/sequence",{id:$_GET.id,fetch:1},function(data){
					var windowModel = null;
					for (var i = 0; i < windowModels.length; i++ ){
						if ( windowModels[i]._id == data.windowModel ){
							windowModel = windowModels[i];
						}
					}
					windowModel = windowModelSingleToMulti(windowModel, data.width, data.height);
					currentWindowModel = windowModel;
					initGrid(windowModel.cols,windowModel.rows,windowModel.ratio);
		            mainSequence = new Sequence($("#mainSequence"), parseInt(data.duration),data.width,data.height,windowModel);
					mainSequence.sequenceEvents = [];
					if ( data.music ){
						mainSequence.addMusic(data.music)
					}
		            mainSequence.draw();
		            $("#fileName").val(data.name)
					console.log(data);
		            var sequenceData = data;
		            for(var i in data.sequenceEvents){
		                var newEvent = new SequenceEvent(mainSequence,data.sequenceEvents[i].timeAt,data.sequenceEvents[i].duration);
						newEvent.transition = data.sequenceEvents[i].transition;
		                mainSequence.sequenceEvents.push(newEvent);
						for ( var j = 0; j < data.sequenceEvents[i].slides.length; j++ ){
							console.log("j " + j)
			                $.ajax("/slide",{
			                    async:false,
			                    dataType: 'json',
			                    data: {id:data.sequenceEvents[i].slides[j].slide},
			                    success: function (slideData){
									sequenceData.sequenceEvents[i].slides[j].slide = slideData;
			                        newEvent.slides.push(sequenceData.sequenceEvents[i].slides[j]);
									slides[slideData._id] = slideData;
			                        newEvent.draw(mainSequence.timeLine); 
			                    }
		                	});
						}
		            }
					currentEvent = data.sequenceEvents[0];
					
					seekTo(0);
		        });
		    }
	
		}else{
			//Show "create window model" page
		}
	})

    $(".slidebox").each(function (){
        $(this).draggable({containment:"document",appendTo:"body",helper:'clone',revert:'invalid'});
    });
    $("#save").click(function (){
        $("#modalWindow2").fadeIn(200);
        $("#fileName").focus();
    });
    $("#cancelSave").click(function (){
        $("#modalWindow2").fadeOut(200);
    });
    $("#lengthValue").focus();
    $("#saveForm").submit(function (){
        var sendData = {duration:mainSequence.duration,sequenceEvents:[],createNew:true,name:$("#fileName").val(),music:mainSequence.music};
		sendData.width = mainSequence.width;
		sendData.height = mainSequence.height;
		sendData.windowModel = mainSequence.windowModel._id;
        var events = mainSequence.sequenceEvents;
        for(var i in events){
            var event = events[i];
            var newEvent = new Object();
            newEvent.timeAt = event.timeAt;
			newEvent.transition = event.transition;
            newEvent.slides = [];
            for ( var j in event.slides ){
                var slide = event.slides[j];
                newEvent.slides.push({winX:slide.winX,winY:slide.winY,slide:slide.slide._id});
            }
            sendData.sequenceEvents.push(newEvent);
        }
        if ( $_GET.id != null ){
            sendData.createNew = false;
            sendData.edit = true;
            sendData.id = $_GET.id;
        }
        $.post("/sequence",sendData,function(data){
            if(data == "ok"){
                window.location.href = "/";
                return false;
            }else{
                alert(data);
            }
        });
        return false;
    });
    $("#scrubber").draggable({
        axis:'x',
        containment:"parent",
		drag: function (ev, ui){
			seekTo(ui.position.left/mainSequence.timeLine.width()*mainSequence.duration,true);
		}
    })
	$("#play").click(function (){
		play();
	});
	$("#forward").on('mousedown', function (){
		play(true);
		ffwd();
	})
	$("#forward").on('mouseup', function (){
		pause();
	});
	$("#backward").on('mousedown', function (){
		play(true);
		fbwd();
	})
	$("#backward").on('mouseup', function (){
		pause();
	})
    $("#newKeyframe").click(function (){
        var newEvent = new SequenceEvent(mainSequence,mainTimeAt);
        for( var i in currentEvent.slides ){
            newEvent.slides.push(currentEvent.slides[i]);
        }
        mainSequence.sequenceEvents.push(newEvent);
        newEvent.draw(mainSequence.timeLine); 
        newEvent.setSelected(); 
        seekTo(mainTimeAt);
    });
	$("#emptyEvent").click(function (){
		currentEvent.slides = [];
		seekTo(mainTimeAt);
	});
	$("#refreshSlides").click(function (){
		$("#slideLibrary").slideBrowser(false,3,function (){},"slidebox");
	});

	$("#slideLibrary").slideBrowser(false,3,function (){},"slidebox");
});

$(document.body).keydown(function(e){
    var keycode =  e.keyCode ? e.keyCode : e.which;
    if( (keycode == 8 || keycode == 46) && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement) ){ // backspace
        for ( i in mainSequence.sequenceEvents ){
            ev = mainSequence.sequenceEvents[i];
            if ( ev.selected == true ){
                ev.block.remove();
                mainSequence.sequenceEvents.splice(i,1);
                return false;
            }
        }
        return false;
    }
});

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
