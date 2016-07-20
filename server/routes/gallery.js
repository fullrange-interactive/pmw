var fs = require('fs');
var url = require('url');
var gm = require('gm');
var path = require('path');
var exec =  require('child_process').exec;
var walk  = require('walk');
var gm = require('gm');

var files   = [];
var analysing = [];

exports.index = function(req, res){
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

            if(files.indexOf(root.replace("public","") + '' + stat.name) < 0  && analysing.indexOf(stat.name) < 0)
            {
                analysing.push(stat.name);

                exec('gm identify -verbose ' + root + '/' + stat.name, function(error, stdout, stderr){
        
                    if(stderr == '')
                    {
                        gm(root + '/' + stat.name).autoOrient().write(root + '/' + stat.name);                     
                        files.push(root.replace("public","") + '' + stat.name);
                    }

                    analysing.splice(analysing.indexOf(stat.name), 1);
                });
            }

            next();
        });

        // walker.on("names", function (root, nodeNamesArray) {
        //     nodeNamesArray.sort(function (a, b) {
        //         if (a > b) return 1;
        //         if (a < b) return -1;
        //         return 0;
        //     });
        // });

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