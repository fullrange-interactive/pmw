var Automator = require('../model/automator');
var Slide = require('../model/slide');

exports.index = function config(req, res){
  if ( req.body.createNew ==  "true" ){
    var newAutomator = new Automator();
    newAutomator.data = {};
    newAutomator.name = req.body.name;
    newAutomator.collections = [];
    for(var i = 0; i < req.body.collections.length; i++){
      newAutomator.collections.addToSet(req.body.collections[i])
    }
    newAutomator.user = req.user._id;
    newAutomator.save(function (err, newAutomator){
      if ( err ){
        console.log("error = " + err);
        return;
      }
      res.send("OK");
    });
  }else if (req.body.edit == "true") {
    var res = res;
    Automator.findById(req.body.id, function(err, automator){
      automator.data = {};
      automator.name = req.body.name;
      automator.collections = [];
      for(var i = 0; i < req.body.collections.length; i++){
        automator.collections.addToSet(req.body.collections[i])
      }
      automator.user = req.user._id;
      automator.save(function (err, automator){
        if ( err ){
          console.log("error = " + err);
          return;
        }
        res.send("OK");
      });
    });
  }else if ( req.query.id && req.query.fetch ){
    Automator.findById(req.query.id,function(err,automator){
    if(err){
      res.send("Not found");
      return;
    }
    res.send(JSON.stringify(automator));
    });
  }else{      
    Slide.find({user:req.user._id}).sort({name:1}).execFind(function(err, slides){
      if ( err ){
          res.render('error', {title: 'Error'});
      }else{
          res.render('automator', {title: "Nouvel Automator", slides: slides, user: req.user});
      }
    });
  }
}