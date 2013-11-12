
/*
 * GET slide.
 */

exports.index = function(req, res){
    Slide.findById(req.query.id,function(err,slide){
        if(err){
            res.send("Not found");
            return;
        }
        res.send(JSON.stringify(slide));
    });
};