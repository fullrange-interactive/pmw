/*
 * GET slide.
 */

exports.index = function(req, res){
	if ( req.query.listFolders ){
		Folder.find(function (err, slides){
			if ( err ){
				res.send("None found");
				return;
			}
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