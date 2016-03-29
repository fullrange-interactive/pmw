var ProcessorPlugin = function ProcessorPlugin(){
    
}

// Processes a GroupSlide at the moment it's being set for (a)
// window(s)
// 
// Parameters:
//   - groupSlide
// Return:
//   - boolean : true if asynchronous, false otherwise
//   

/**
 * Processes a GroupSlide as it's being set for (a) window(s)
 * @param  {GroupSlide} groupSlide  The GroupSlide to process
 * @param {Slide} slide The slide as it is in the database
 * @param {PluginManager~ProcessingCallback} doneCallback [description]
 * @return {[type]}            [description]
 */
ProcessorPlugin.prototype.processGroupSlide = function (groupSlide, slide, slideData, doneCallback){
  return false;
}

module.exports = ProcessorPlugin;