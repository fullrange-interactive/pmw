var fs = require('fs')
var url = require('url')
var gm = require('gm')
var imageType = require('image-type');

exports.index = function(req, res){
    res.header("Access-Control-Allow-Origin","*")
    console.log("Photo");

    if ( req.file ){
        console.log("posted");
        var fd = fs.openSync(req.file.path, 'r');
        var buf = new Buffer(12);
        var nread = fs.readSync(fd, buf, 0, 12, 0);
        var type = imageType(buf);
        if (type.ext !== 'jpg' && type.ext !== 'png') {
            res.status(400).send("Seul les JPEG et les PNG sont supportés sur Pimp My Wall!");
            return;
        }
        fs.readFile(req.file.path, function (err, data) {
            var path = 'public/photos/';
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
            var newPath = path + dateTime + '.' + ext;
            var publicPath = "/photos/" + dateTime + '.' + ext;
            fs.writeFile(newPath, data, function (err) {
                gm(newPath).resize(1024,1024).autoOrient().write(newPath,function (err){
                    res.send(JSON.stringify({url:publicPath}));
                });
            });
        });
    } else if ( req.body.base64Image ){
        var path = 'public/photos/';
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
        var newPath = path + dateTime + '.' + ext;
        var publicPath = "/photos/" + dateTime + '.' + ext;

        base64Image = req.body.base64Image.replace("data:image/" + ext + ";base64,", "");
        var data = new Buffer(base64Image, 'base64');
        var type = imageType(data);
        if (type.ext !== 'jpg' && type.ext !== 'png') {
            res.status(400).send("Seuls les JPEG et les PNG sont supportés sur Pimp My Wall!");
            console.log("Err" + type.ext)
            return;
        }

        fs.writeFile(newPath, data, function (err) {
            gm(newPath).resize(1024,1024).autoOrient().write(newPath,function (err){
                res.send(JSON.stringify({url:publicPath}));
            });
        });
    }else{
        res.send("Error - no file received in POST");
    }

    // if ( req.files.file != null ){
    //     fs.readFile(req.files.file.path, function (err, data) {
    //         var path = 'public/photos/';
    //         var splits = req.files.file.originalFilename.toLowerCase().split(".");
    //         var ext = splits[splits.length-1];
    //         var allowedExts = ['png','jpg','jpeg'];
    //         var found = false;
    //         for ( var i in allowedExts ){
    //             if ( ext.indexOf(allowedExts[i]) != -1 ){
    //                 found = true;
    //                 break;
    //             }
    //         }
    //         if ( !found ){
    //             res.status(500).send('error');
    //             return;
    //         }
    //         var dateTime = new Date().getTime();
    //         var newPath = path + dateTime + '.' + ext;
    //         var publicPath = "/photos/" + dateTime + '.' + ext;
    //         fs.writeFile(newPath, data, function (err) {
    //             gm(newPath).resize(1600,1600).autoOrient().write(newPath,function (err){
    //                 res.send(JSON.stringify({url:publicPath}));
    //             });
    //         });
    //     });
    // }
}