Window = require('../model/window');

exports.index = function (req, res)
{
	if ( req.body.createNew == "true" ){
		var newWindow = new Window();
		newWindow.name = req.body.name;
		newWindow.windowId = req.body.windowId;
		newWindow.user = req.user._id;
		newWindow.save(newWindow,function (err, window){
			if ( err ) res.send(err);
			windows = [];
			Window.find().sort({windowId:1}).execFind(function(err,result){
			    for(i in result){
			        windows.push(result[i]);
			    }
			    //windows = result;
			    console.log(result);
			})
		})
		res.redirect("/");
		return;
	}
	if ( req.query.id ){
		res.send("todo: edit window");
		return;
	}
	res.render("newWindow");
}