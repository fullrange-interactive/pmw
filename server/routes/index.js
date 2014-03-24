
/*
 * GET home page.
 */
Sequence = require('../model/sequence');

exports.index = function(req, res){
    if ( req.query ){
        if ( req.query.delete )
            Slide.findByIdAndRemove(req.query.delete,function(err){
                if(err){
                    res.send("could not delete");
                    return;
                }
            });
        else if ( req.query.deleteSequence )
            Sequence.findByIdAndRemove(req.query.deleteSequence,function(err){
                if(err){
                    res.send("could not delete");
                    return;
                }
            });
        else if ( req.query.window ){
			if ( req.query.slide )
            	setSlideForWindow(req.query.slide,req.query.window);
			else if ( req.query.sequence )
				setSequenceForWindow(req.query.sequence,req.query.window);
            res.redirect("/");
			return;
        }
        else if ( req.query.windowSequence ){
            setSequenceForWindow(req.query.sequence,req.query.window);
            res.redirect("/");
			return;
        }
    }
    Slide.find({user:req.user._id}).sort({name:1}).execFind(function(err, slides){
        if ( err ){
            res.render('error', {title: 'Error'});
        }else{
			Sequence.find().sort({name:1}).execFind(function (err, sequences){
				Window.find({user:req.user._id}).sort({windowId:1}).execFind(function (err, dbwindows){
					for(var i in windows){
						for(var j in dbwindows){
							if ( dbwindows[j].windowId == windows[i].windowId ){
								dbwindows[j].connected = windows[i].connected;
								dbwindows[j].privateIp = windows[i].privateIp;
							}
						}
					}
					//console.log("===" + JSON.stringify(dbwindows));
					res.render('index', {title: "Supervision", slides: slides, wins:dbwindows, sequences:sequences, user:req.user});
				});
			});
        }
    });
};