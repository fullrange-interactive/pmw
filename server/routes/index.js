
/*
 * GET home page.
 */

exports.index = function(req, res){
    if ( req.query ){
        if ( req.query.delete )
            Slide.findByIdAndRemove(req.query.delete,function(err){
                if(err){
                    res.send("could not delete");
                    return;
                }
            });
        else if ( req.query.window ){
            setSlideForWindow(req.query.slide,req.query.window);
            res.redirect("/");
        }
    }
    
    Slide.find().sort({name:1}).execFind(function(err, slides){
        if ( err ){
            res.render('error', {title: 'Error'});
        }else{
            res.render('index', {title: "Pimp My Wall", slides: slides, windows:windows});
        }
    });
};