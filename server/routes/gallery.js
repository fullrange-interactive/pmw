var fs = require('fs')
var url = require('url')
var gm = require('gm')
var path = require('path')

var directory = 'public/gallery-photos/';

exports.index = function(req, res){
    var walk    = require('walk');
    var files   = [];
    res.header("Access-Control-Allow-Origin","*")
    
    if ( req.query.listImages ){
        // Walker options
        var walker = walk.walk(directory, { followLinks: false});

        walker.on('file', function(root, stat, next) {
            // Add this file to the list of files
            if(stat.name == ".DS_Store"){
                next();
                return;
            }
            files.push(root.replace("public","") + '' + stat.name);
            next();
        });

        walker.on('end', function() {
            res.send(JSON.stringify(files));
        });
    } else if (req.query.deleteImage) {
        try {
            var fileName = path.basename(req.query.deleteImage);
            var fileInfo = fs.accessSync(directory + fileName, fs.R_OK);
            fs.unlinkSync(directory + fileName);
            res.send("OK");
        } catch (e) {
            res.send("Error - file could not be deleted! " + e);
        }
    } else {
        res.send();
    }
}