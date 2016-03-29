var ProcessorPlugin = require('../modules/processor');
var util = require('util');

var DrawingProcessor = function DrawingProcessor(){
    DrawingProcessor.super_.call(this);
}

util.inherits(DrawingProcessor, ProcessorPlugin);

DrawingProcessor.prototype.processGroupSlide = function (groupSlide, slide, slideData, doneCallback){
    var amountToProcess = 0;
    var amountProcessed = 0;

    var data = {relems: {}};

    if ( slide._id != Configuration.drawingSlideId ){
        for ( var i = 0; i < slide.relems.length; i++ ){
            var relem = slide.relems[i];
            if ( relem.type == "Drawing" ){
                amountToProcess++;
            }
        }
        for ( var i = 0; i < slide.relems.length; i++ ){
            var relem = slide.relems[i];
            if ( relem.type == "Drawing" ){
                Drawing.findOfType(relem.data.type, function(relem, err, drawing){
                    data.relems[relem._id] = {id: drawing._id};
                    amountProcessed++;
                    if ( amountProcessed === amountToProcess ){
                        doneCallback(0, data);
                    }
                }.bind(this, relem));
            }
        }
    }       

    if ( slide._id == Configuration.drawingSlideId ){
        for ( var i = 0; i < slide.relems.length; i++ ){
            var relem = slide.relems[i];
            if ( relem.type == "Drawing" && slideData ){
                data.relems[relem._id] = {id: slideData.drawing};
            }
        }
    }

    if ( amountToProcess === 0 ){
        doneCallback(0, {});
    }
}

module.exports = DrawingProcessor;