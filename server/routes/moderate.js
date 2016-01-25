
/*
* GET home page.
*/

exports.index = function(req, res){
    if ( req.query.moderate ){
        if ( req.query.validate == 1 ){
            Drawing.findById(req.query.id, function(err, drawing){
                drawing.validated = true;
                drawing.moderated = true;
                AutomatorManagerInstance.AddSlideToGroupQueue(Configuration.drawingSlideId,drawing.preferredGroupId,{drawing:drawing._id});
                drawing.save(function(err, drawing){
                    if(err){
                        res.send("error");
                        return;
                    }
                    res.send("ok");
                });
            });
        }else if ( req.query.refuse == 1 ){
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
        }else if ( req.query.delete == 1 ){
            Drawing.findById(req.query.id, function(err, drawing){
                drawing.validated = false;
                drawing.deleted = true;
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
        if ( !req.query.page )
                req.query.page = 1;
        if ( req.query.show == 'new' || req.query.show == undefined ){
            Drawing.find({moderated:false,$or:[{deleted:null},{deleted:false}]}).sort({date:-1}).execFind(function(err, drawings){
                if ( err ){
                    res.render('error', {title: 'Error'});
                }else{
                    if ( req.query.ajax ){
                        res.send(JSON.stringify(drawings));
                    }else{
                        res.render('moderate', {title: "Modérer", drawings: drawings,pageAction:req.query.show, user: req.user, page:req.query.page, show:req.query.show});
                    }
                }
            });
        }else if ( req.query.show == 'refused' ){
            Drawing.find({moderated:true,validated:false,$or:[{deleted:null},{deleted:false}]}).sort({date:-1}).execFind(function(err, drawings){
                if ( err ){
                    res.render('error', {title: 'Error'});
                }else{
                    if ( req.query.ajax ){
                        res.send(JSON.stringify(drawings));
                    }else{
                        res.render('moderate', {title: "Modérer", drawings: drawings,pageAction:req.query.show, user: req.user, page:req.query.page, show:req.query.show});
                    }
                }
            });
        }else if ( req.query.show == 'validated' ){
            Drawing.find({moderated:true,validated:true,$or:[{deleted:null},{deleted:false}]}).sort({date:-1}).execFind(function(err, drawings){
                if ( err ){
                    res.render('error', {title: 'Error'});
                }else{
                    if ( req.query.ajax ){
                        res.send(JSON.stringify(drawings));
                    }else{
                        res.render('moderate', {title: "Modérer", drawings: drawings,pageAction:req.query.show, user: req.user, page:req.query.page, show:req.query.show});
                    }
                }
            });
        }
    }
};