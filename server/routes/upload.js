var fs = require('fs')
var url = require('url')

exports.index = function(req, res){
	if ( req.query.delete != null ){
		if ( url.parse(req.query.delete).pathname.indexOf('/gallery/') != 0 ){
			if ( url.parse(req.query.delete).pathname.indexOf('/videos/') != 0 ){
				res.send('error:' + url.parse(req.query.delete).pathname);
				return;
			}
		}
		var res = res;
		fs.unlink('public' + url.parse(req.query.delete).pathname, function (err){
			if ( err ){
				res.send('error: ' + err);
				return;
			}
		});
		res.send("ok");
		return;
	}else if ( req.files.file != null ){
		fs.readFile(req.files.file.path, function (err, data) {
			var path = 'public/gallery/';
			var splits = req.files.file.originalFilename.split(".");
			var ext = splits[splits.length-1];
			var allowedExts = ['gif','png','jpg','jpeg','mp4','avi','mkv'];
			var found = false;
			for ( var i in allowedExts ){
				if ( ext.indexOf(allowedExts[i]) != -1 ){
					found = true;
					break;
				}
			}
			if ( !found ){
				res.status(500).send('error');
				return;
			}
			if ( ext == 'mp4' || ext == 'avi' || ext == 'mkv' ){
				path = 'public/videos/'
			}
			var newPath = path + new Date().getTime() + '.' + ext;
			fs.writeFile(newPath, data, function (err) {
				res.send('');
			});
		});
	}
	res.send('');
}