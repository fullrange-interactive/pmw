var WindowModel = require('../model/windowModel');

exports.index = function (req, res){
	newWindowModel = new WindowModel();
	newWindowModel.name = req.query.name;
	newWindowModel.cols = [0.2,0.2,0.2,0.2,0.2];
	newWindowModel.rows = [0.25,0.25,0.25,0.25];
	newWindowModel.user = req.user._id;
	newWindowModel.save(function (err, windowModel){
		if ( err ) res.send(err);
		res.send("Ok");
	})
};