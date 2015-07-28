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
		AutomatorManagerInstance.AddSlideToGroupQueue(Configuration.fireworksSlideId,Configuration.fireworksGroupId,{
            type:fireworksType, 
            angle:angle, 
            power:power, 
            secondaryColor: secondaryColor,
            primaryColor: primaryColor
        });
		res.send(JSON.stringify({responseType:'ok'}));
	}    
}