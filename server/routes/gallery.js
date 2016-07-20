var fs = require('fs');
var url = require('url');
var gm = require('gm');
var path = require('path');
var exec =  require('child_process').exec;

exports.index = function(req, res){
    var walk    = require('walk');
    var files   = [];
    res.header("Access-Control-Allow-Origin","*")
    
    if ( req.query.listImages ){
        // Walker options
        var walker = walk.walk(Configuration.galleryDirectory, { followLinks: false});

        walker.on('file', function(root, stat, next) {
            // Add this file to the list of files
            if(stat.name == ".DS_Store"){
                next();
                return;
            }

            exec('gm identify -verbose ' + root + '/' + stat.name, function(error, stdout, stderr){
    
                if(stderr == '')
                    files.push(root.replace("public","") + '' + stat.name);

                console.log("GM: "+stderr);
            });

            next();
        });

        walker.on("names", function (root, nodeNamesArray) {
            nodeNamesArray.sort(function (a, b) {
                if (a > b) return 1;
                if (a < b) return -1;
                return 0;
            });
        });

        walker.on('end', function() {
            res.send(JSON.stringify(files));
        });
    } else if (req.query.deleteImage) {
        try {
            var fileName = path.basename(req.query.deleteImage);
            var fileInfo = fs.accessSync(Configuration.galleryDirectory + fileName, fs.R_OK);
            fs.unlinkSync(Configuration.galleryDirectory + fileName);
            res.send("OK");
        } catch (e) {
            res.send("Error - file could not be deleted! " + e);
        }
    } else {
        res.send();
    }
}