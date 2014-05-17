var mongoose = require('mongoose');

var FolderSchema = mongoose.Schema({
	name: String,
	slides: [{type:mongoose.Schema.ObjectId, ref:'Slide'}],
	user: mongoose.Schema.ObjectId
})

var Folder = mongoose.model('Folder', FolderSchema);
module.exports = Folder;