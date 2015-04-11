var Automator = require('../model/automator');

exports.index = function config(req, res){
	if ( req.query.createNew ){
		var newAutomator = new Automator();
		newAutomator.data = {};
		newAutomator.collections = [];
		var newCollection = {collectionElements:[],data:{},period:1000,type:"random"};
		newCollection.collectionElements.push({
			element: "537553671cf625787800000b",
			data: {probability:0.5},
			type: "slide"
		});
		newCollection.collectionElements.push({
			element: "53568ef3a43d33ef3b000004",
			data: {probability:0.5},
			type: "slide"
		})
		newAutomator.collections.addToSet(newCollection)
		newAutomator.save(function (err, newAutomator){
			if ( err ){
				console.log("error = " + err);
				return;
			}
			res.send("OK");
		});
	}
}