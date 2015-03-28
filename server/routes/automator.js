exports.index = function config(req, res){
	res.header('Content-Type','application/json');
    res.render('moderate', {title: "Modérer", drawings: drawings,pageAction:req.query.show, user: req.user});
}