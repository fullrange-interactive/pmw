var mongoose = require('mongoose');

var OptionSchema = mongoose.Schema({
    name: String,
    data: mongoose.Schema.Types.Mixed
})

var Option = mongoose.model('Option', OptionSchema);
module.exports = Option;