/*
 * GET sequence.
 */

exports.index = function(req, res){
    if ( req.body.createNew == "true" ){
        var newSequence = new Sequence();
        var res = res;
        newSequence.sequenceEvents = [];
        newSequence.name = req.body.name;
		newSequence.duration = req.body.duration;
		newSequence.user = req.user._id;
        for(var i in req.body.sequenceEvents){
            var ev = req.body.sequenceEvents[i];
            newSequence.sequenceEvents.addToSet({timeAt:ev.timeAt,duration:ev.duration,slide:ev.slide});
        }
        newSequence.save(function(err, newSequence){
            if(err){
                res.send("error");
                return;
            }
            res.send("ok");
        });
    }else if (req.body.edit == "true") {
        var res = res;
        Sequence.findById(req.body.id, function(err, sequence){
            sequence.sequenceEvents = [];
            sequence.name = req.body.name;
            sequence.duration = req.body.duration;
			sequence.user = req.user._id;
            for(var i in req.body.sequenceEvents){
                var ev = req.body.sequenceEvents[i];
                sequence.sequenceEvents.addToSet({slide:ev.slide,timeAt:ev.timeAt,duration:ev.duration});
            }
            sequence.save(function(err, newSequence){
                if(err){
                    res.send("error");
                    return;
                }
                res.send("ok");
            });
        });
	}else if (req.query.id && req.query.fetch){
		Sequence.findById(req.query.id,function (err,sequence){
			if ( !err ){
				res.send(JSON.stringify(sequence));
			}
		});
    }else{
	    Slide.find({user:req.user._id}).sort({name:1}).execFind(function(err, slides){
	        if ( err ){
	            res.render('error', {title: 'Error'});
	        }else{
				Window.find({user:req.user._id}).sort({windowId:1}).execFind(function (err, windows){
					res.render('sequence', {title: "Nouvelle Séquence", slides: slides, windows:windows, user: req.user});
				})
	        }
	    });
	}
};