var WindowModel = require('../model/windowModel');

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
	}/*else{
		newWindowModel = new WindowModel();
		newWindowModel.name = req.query.name;
		newWindowModel.cols = [0.18057142857142858, 0.021714285714285714, 0.18057142857142858, 0.021714285714285714, 0.18057142857142858, 0.021714285714285714, 0.18057142857142858, 0.021714285714285714, 0.18057142857142858];
		newWindowModel.rows = [0.16304347826086957, 0.041304347826086954, 0.31521739130434784, 0.17391304347826086, 0.31521739130434784];
		newWindowModel.user = req.user._id;
		newWindowModel.save(function (err, windowModel){
			if ( err ) res.send(err);
			res.send("Ok");
		})
		return;
	}*/
};