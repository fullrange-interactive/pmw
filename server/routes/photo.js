var fs = require('fs')
var url = require('url')
var gm = require('gm')

exports.index = function(req, res){
  res.header("Access-Control-Allow-Origin","*")
  if ( req.files.file != null ){
    fs.readFile(req.files.file.path, function (err, data) {
      var path = 'public/photos/';
      var splits = req.files.file.originalFilename.toLowerCase().split(".");
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
        gm(newPath).resize(1600,1600).autoOrient().write(newPath,function (err){
          res.send(JSON.stringify({url:publicPath}));
        });
      });
    });
  }
}