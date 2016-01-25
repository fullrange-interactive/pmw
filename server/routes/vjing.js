var fs = require('fs')
var url = require('url')
var gm = require('gm')

exports.index = function(req, res){
  var walk    = require('walk');
  var files   = [];
  
  res.header("Access-Control-Allow-Origin","*")
  if ( req.query.listImages ){
    // Walker options
    var walker = walk.walk('public/vjing-images/', { followLinks: false});

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
  }else{
    if ( req.body.clip ){
      var gifClip = req.body.clip;
      var videoClip = gifClip.replace("vjing-images","vjing-videos").replace(".gif",".mp4");
      AutomatorManagerInstance.AddSlideToGroupQueue(Configuration.vjingSlideId,req.body.groupId,{clip:videoClip});
      res.send(JSON.stringify({responseType:'ok'}));
    }
  }
}