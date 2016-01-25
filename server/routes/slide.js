/*
 * GET slide.
 */

exports.index = function(req, res){
  if ( req.query.listFolders ){
    Folder.find({user:req.user.id},function (err, slides){
      if ( err ){
        return;
      }
      res.send(JSON.stringify(slides));
    });
  }else if ( req.query.id ){
    Slide.findById(req.query.id,function(err,slide){
      if(err){
        res.send("Not found");
        return;
      }
      res.send(JSON.stringify(slide));
    });
  }
};