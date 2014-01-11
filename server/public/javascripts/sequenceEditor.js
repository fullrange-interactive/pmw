var SequenceEvent = Class.extend({
    duration: 0,
    timeAt: 0,
    slide: null,
    isDrawn: false,
    block: null,
    blockDurationText: null,
    blockNameText: null,
    sequence: null,
    selected: false,
    initialize: function (sequence,timeAt,duration){
        this.sequence = sequence;
        this.timeAt = timeAt;
        this.duration = duration;
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
            this.blockDurationText = $('<p class="eventBlockDuration">'+secondsToHumanTime(this.duration)+'</p>');
            this.block.append(this.blockDurationText);
            this.blockNameText = $('<p class="eventBlockName">Slide1</p>');
            this.block.append(this.blockNameText);
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
                }
            });
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
                }
            });
        }
        this.block.css("width",this.duration/this.sequence.duration*100 + "%");
        this.block.css("left",this.timeAt/this.sequence.duration*100 + "%");
        this.blockDurationText.html(secondsToHumanTime(this.duration));
        this.blockNameText.html(this.slide.name);
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
    initialize: function (domObject,duration){
        this.duration = duration;
        this.domObject = domObject;
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
            this.timeLine.droppable({
                accept:".slidebox",
                drop: function (e, ui){
                    left = ui.position.left-$(this).offset().left;
                    var newEvent = new SequenceEvent(that,left/$(this).width()*that.duration,$(ui.helper).width()/$(this).width()*that.duration);
                    that.sequenceEvents.push(newEvent);
                    $.getJSON("/slide",{id:$(ui.draggable).attr('id')},function(data){
                        newEvent.slide = data;
                        newEvent.draw(that.timeLine); 
                        newEvent.setSelected(); 
                    });
                },
                over: function (e, ui){
                    ui.helper.animate({backgroundColor:"rgba(152,184,126,0.6)"},100);
                },
                out: function (e, ui){
                    ui.helper.animate({backgroundColor:"rgba(0,0,0,0.1)"})
                }
            })
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
    if ( !$_GET.id ){
        $("#modalWindow").fadeIn(200);
        $("#okCreate").click(function (){
            mainSequence = new Sequence($("#mainSequence"), parseInt($("#lengthValue").val()) * parseInt($("#lengthUnit").val()) );
            mainSequence.draw();
            $("#modalWindow").fadeOut();
        });
    }else{
        $.getJSON("/sequence",{id:$_GET.id,fetch:1},function(data){
            mainSequence = new Sequence($("#mainSequence"), parseInt(data.duration));
            mainSequence.draw();
            $("#fileName").val(data.name)
            var sequenceData = data;
            for(var i in data.sequenceEvents){
                var newEvent = new SequenceEvent(mainSequence,data.sequenceEvents[i].timeAt,data.sequenceEvents[i].duration);
                mainSequence.sequenceEvents.push(newEvent);
                $.ajax("/slide",{
                    async:false,
                    dataType: 'json',
                    data: {id:data.sequenceEvents[i].slide},
                    success: function (data){
                        newEvent.slide = data;
                        newEvent.draw(mainSequence.timeLine); 
                    }
                });
            }
        });
    }
    $(".slidebox").each(function (){
        $(this).get().slideId = "aa";
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
        var sendData = {duration:mainSequence.duration,sequenceEvents:[],createNew:true,name:$("#fileName").val()};
        var events = mainSequence.sequenceEvents;
        for(var i in events){
            var event = events[i];
            var newEvent = new Object();
            newEvent.timeAt = event.timeAt;
            newEvent.duration = event.duration;
            newEvent.slide = event.slide._id;
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
        containment:"parent"
    })
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