
/*
 * Slide creator
 */
var config = require('../config');
 
var fs = require('fs');

exports.index = function(req, res){
  res.header("Access-Control-Allow-Origin","*")
  if ( req.body.color ){
    Server.sendDataToAll({type:"stroke",stroke:{duration:req.body.duration,points:req.body.points, color:req.body.color, lineWidth:req.body.lineWidth}})
  }
  res.send("ok");
};