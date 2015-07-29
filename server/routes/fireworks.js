var fs = require('fs')
var url = require('url')
var gm = require('gm')

exports.index = function(req, res){
    var walk    = require('walk');
    var files   = [];
	
	res.header("Access-Control-Allow-Origin","*");
    
	if ( req.body.type ){
        var fireworksType = req.body.type;
        var primaryColor = req.body.primaryColor;
        var secondaryColor = req.body.secondaryColor;
        var angle = req.body.angle;
        var power = req.body.power;
        var seed = Math.floor(Math.random()*1000000);
		AutomatorManagerInstance.AddSlideToGroupQueue(Configuration.fireworksSlideId,Configuration.fireworksGroupId,{
            type:fireworksType, 
            angle:angle, 
            power:power, 
            secondaryColor: secondaryColor,
            primaryColor: primaryColor,
            seed: seed
        });
		res.send(JSON.stringify({responseType:'ok'}));
	}    
}