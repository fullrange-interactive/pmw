var fs = require('fs')
var url = require('url')
var gm = require('gm')

exports.index = function(req, res){
    res.header("Access-Control-Allow-Origin","*");
    
    if ( req.file ){
        fs.readFile(req.file.path, function (err, data) {
            var path = 'public/screenshots/';
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
            var newPath = path + parseInt(req.body.windowId) + '.' + ext;
            fs.writeFile(newPath, data, function (err) {
                res.send("ok");
            });
        });
    }else{
        res.send("Error - no file received in POST");
    }
}