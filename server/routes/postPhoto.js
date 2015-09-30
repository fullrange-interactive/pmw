var fs = require('fs')
var url = require('url')
var gm = require('gm')

var resizeWidth  = 640;
var resizeHeight = 640;

function processImage(path, overlay, done){
    gm(path).size(function (err, size){
        if ( err ){
            done(err);
            return;
        }
        var w = size.width;
        var h = size.height;
        var ox = 0;
        var oy = 0;
        var dim = 0;
        if ( w > h ){
            ox = (w - h)/2;
            w = h;
            dim = w;
        }else{
            oy = (h - w)/2;
            h = w;
            dim = h;
        }
        
        if ( !overlay ){
            gm(path)
            .crop(dim, dim, ox, oy)
            .resize(resizeWidth, resizeHeight)
            .write(path, function (err){
                if ( err ){
                    done(err);
                    return;
                }
                done(err);
            });
        }else{
            gm(path)
            .autoOrient()
            .write(path, function (err){
                gm(path).size(function (err, size){
                    if ( err ){
                        done(err);
                        return;
                    }
                    var w = size.width;
                    var h = size.height;
                    var ox = 0;
                    var oy = 0;
                    var dim = 0;
                    if ( w > h ){
                        ox = (w - h)/2;
                        w = h;
                        dim = w;
                    }else{
                        oy = (h - w)/2;
                        h = w;
                        dim = h;
                    }

                    gm(path)
                    .crop(dim, dim, ox, oy)
                    .resize(resizeWidth, resizeHeight)
                    .draw(['image Over 0,0 0,0 public/images/overlay-3.png'])
                    .write(path, function (err){
                        if ( err ){
                            done(err);
                            return;
                        }
                        done(err);
                    });
                })
            });
        }
    });
}

exports.index = function(req, res){
	res.header("Access-Control-Allow-Origin","*");
    
	if ( req.file ){
		fs.readFile(req.file.path, function (err, data) {
			var path = 'public/photos-bcvs/';
			var splits = req.file.originalname.toLowerCase().split(".");
			var ext = splits[splits.length-1];
			var allowedExts = ['png','jpg','jpeg'];
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
			var dateTime = new Date().getTime();
			var newPath = path + parseInt(dateTime) + '.' + ext;
			fs.writeFile(newPath, data, function (err) {
                processImage(newPath, true, function (err){
                    console.log("processing done - added overlay");
                    if ( err ){
                        res.send(JSON.stringify({error: "Erreur - Votre image a un problème. Veuillez réessayer"}));
                        return;
                    }
                    res.send(JSON.stringify({message: "OK", src: newPath}));
                    return;
                });
			});
		});
	}else if ( req.body.base64Image ){
		var path = 'public/photos-bcvs/';
		var ext = req.body.imageFormat;
		var allowedExts = ['png','jpg','jpeg'];
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
		var dateTime = new Date().getTime();
		var newPath = path + parseInt(dateTime) + '.' + ext;
        base64Image = req.body.base64Image.replace("data:image/" + ext + ";base64,", "");
        var data = new Buffer(base64Image, 'base64');
		fs.writeFile(newPath, data, function (err) {
            processImage(newPath, false, function (err){
                console.log("processing done - no overlay");
                if ( err ){
                    res.send(JSON.stringify({error: "Erreur - Votre image a un problème. Veuillez réessayer" + err}));
                    return;
                }
                res.send(JSON.stringify({message: "OK", src: newPath}));
                return;
            });
        });
    }else{
	    res.send("Error - no file received in POST");
	}
}