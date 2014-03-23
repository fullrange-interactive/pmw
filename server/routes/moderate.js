
/*
 * GET home page.
 */

exports.index = function(req, res){
    if ( req.query.moderate ){
        if ( req.query.validate == 1 )
            Drawing.findById(req.query.id, function(err, drawing){
                drawing.validated = true;
                drawing.moderated = true;
                drawing.save(function(err, drawing){
                    if(err){
                        res.send("error");
                        return;
                    }
                    res.send("ok");
                });
            });
        else if ( req.query.refuse == 1 ){
            Drawing.findById(req.query.id, function(err, drawing){
                drawing.validated = false;
                drawing.moderated = true;
                drawing.save(function(err, drawing){
                    if(err){
                        res.send("error");
                        return;
                    }
                    res.send("ok");
                });
            });
        }else if ( req.query.like == 1 || req.query.like == -1 ){
            Drawing.findById(req.query.id, function(err, drawing){
                drawing.likes = drawing.likes + parseInt(req.query.like);
                drawing.save(function(err, drawing){
                    if(err){
                        res.send("error");
                        return;
                    }
                    res.send("ok");
                });
            });
        }
    }else{
        if ( req.query.show == 'new' || req.query.show == undefined )
            Drawing.find({moderated:false}).sort({date:-1}).execFind(function(err, drawings){
                if ( err ){
                    res.render('error', {title: 'Error'});
                }else{
                    res.render('moderate', {title: "Pimp My Wall", drawings: drawings,pageAction:'new'});
                }
            });
        else if ( req.query.show == 'refused' )
            Drawing.find({moderated:true,validated:false}).sort({date:-1}).execFind(function(err, drawings){
                if ( err ){
                    res.render('error', {title: 'Error'});
                }else{
                    res.render('moderate', {title: "Pimp My Wall", drawings: drawings,pageAction:req.query.show});
                }
            });
        else if ( req.query.show == 'validated' )
            Drawing.find({moderated:true,validated:true}).sort({date:-1}).execFind(function(err, drawings){
                if ( err ){
                    res.render('error', {title: 'Error'});
                }else{
                    res.render('moderate', {title: "Pimp My Wall", drawings: drawings,pageAction:req.query.show});
                }
            });
    }
};