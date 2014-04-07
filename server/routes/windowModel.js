var WindowModel = require('../model/windowModel');
var Configuration = require('../config');

exports.index = function (req, res){
	if ( req.query.id ){
		WindowModel.findById(req.query.id, function (err, windowModel){
			res.send(JSON.stringify(windowModel));
		});
		return;
	}
	if ( req.query.getAll ){
		WindowModel.find({user:req.user._id}).sort({name:1}).execFind(function (err, windowModels){
			res.send(JSON.stringify(windowModels));
		});
		return;
	}else if ( req.query.name && req.query.createNew ){
		newWindowModel = new WindowModel();
		newWindowModel.name = req.query.name;
		newWindowModel.cols = [
			0.025714285714285714,
			0.15380952380000001,
			0.15380952380000001,
			0.15380952380000001,
			0.012857142857142857,
			0.012857142857142857,
			0.15380952380000001,
			0.15380952380000001,
			0.15380952380000001,
			0.025714285714285714
		]
		newWindowModel.rows = [
			0.1724137931034483,
			0.027586206896551724,
			0.027586206896551724,
			0.16034482758620688,
			0.01206896551724138,
			0.01206896551724138,
			0.17586206896551723,
			0.01206896551724138,
			0.01206896551724138,
			0.16034482758620688,
			0.027586206896551724,
			0.027586206896551724,
			0.1724137931034483
		];
		newWindowModel.mask = "http://" + Configuration.url + "/images/BaleinevMask.png";
		newWindowModel.user = req.user._id;
		newWindowModel.ratio = 1.20689655172;
		newWindowModel.save(function (err, windowModel){
			if ( err ) res.send(err);
			res.send("Ok");
		})
		return;
	}
};