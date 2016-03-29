var fs = require('fs');
var url = require('url');
var ffmpeg = require('fluent-ffmpeg');
var gm = require('gm');

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
            var allowedExts = ['gif','png','jpg','jpeg','mp4','avi','mkv','pdf'];
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

            var postProcessFunction = null;

            if ( ext == 'mp4' || ext == 'avi' || ext == 'mkv' ){

                path = 'public/videos/';

                postProcessFunction = function (pathObject,callback,res) {

                    var proc = new ffmpeg(pathObject.full)

                    .on("error", function(err,stderr,stdout){
                        console.log(err.message + " " + stdout + " - " + stderr);
                        res.status(500).send('error');                        
                    })
                    .takeScreenshots({
                        count: 1,
                        filename: uniqueId + '.' + ext + '.png',
                        timemarks: [ '0' ] // number of seconds
                        }, 'public/videos', function(err) {
                            callback(pathObject.full);
                            console.log("upload " + err);
                            //console.log('screenshots were saved')
                    });
                }
            }
            if ( ext == 'pdf'){

                path = 'public/pdf/';

                postProcessFunction = function (pathObject,callback,res){

                    gm(pathObject.full+'[0-100]').density(150,150).adjoin().write(pathObject.path + pathObject.uniqueId + '-%03d.' + pathObject.ext, function (err){
                        callback(pathObject.path + pathObject.uniqueId + '-000.' + pathObject.ext);
                    });
                }
            }

            var uniqueId = new Date().getTime();
            var newPath = path + uniqueId + '.' + ext;

            fs.writeFile(newPath, data, function (err) {
                if (postProcessFunction != null){
                    postProcessFunction({
                            dirPath:path,
                            uniqueId:uniqueId,
                            ext:ext,
                            full:newPath
                        },function(newResourcePath){
                            res.send(newResourcePath.replace('public/',''));
                        },res
                    );
                }
            });
        });
    }
    //res.send('');
}