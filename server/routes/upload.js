var fs = require('fs')
var url = require('url')
var ffmpeg = require('fluent-ffmpeg')

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
            var uniqueId = new Date().getTime();
			var newPath = path + uniqueId + '.' + ext;
            var postProcessFunction = null;
			if ( ext == 'mp4' || ext == 'avi' || ext == 'mkv' ){
				path = 'public/videos/';
                newPath = path + uniqueId + '.' + ext;
                postProcessFunction = function (){
                    var proc = new ffmpeg(newPath)
                    .setFfmpegPath('/home/blroot/ffmpeg')
                    .on("error", function(err,stderr,stdout){
                        console.log(err.message + " " + stdout + " - " + stderr);
                    })
                    .takeScreenshots({
                        count: 1,
                        filename: uniqueId + '.' + ext + '.png',
                        timemarks: [ '0' ] // number of seconds
                      }, 'public/videos', function(err) {
                          console.log("upload " + err);
                          //console.log('screenshots were saved')
                    });
                }
			}
			var newPath = path + new Date().getTime() + '.' + ext;
			fs.writeFile(newPath, data, function (err) {
				res.send('');
                if (postProcessFunction != null){
                    postProcessFunction();
                }
			});
		});
	}
	res.send('');
}