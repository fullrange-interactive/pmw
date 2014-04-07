var Configuration = require('../config');

exports.index = function config(req, res){
	res.header('Content-Type','application/json');
	res.send(JSON.stringify({
		url: Configuration.url,
		defaultImage: Configuration.defaultImage,
		defaultVideo: Configuration.defaultVideo
	}))
}