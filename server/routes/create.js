
/*
 * Slide creator
 */
Slide = require('../model/slide');

exports.index = function(req, res){
  if ( req.body.createNew == "true" ){
    var newSlide = new Slide();
    var res = res;
    newSlide.user = req.user._id;
    newSlide.width = req.body.width;
    newSlide.height = req.body.height;
    newSlide.relems = [];
    newSlide.windowModel = req.body.windowModel;
    newSlide.name = req.body.name;
    for(var i in req.body.relems){
      var relem = req.body.relems[i];
      newSlide.relems.addToSet({x:relem.x,y:relem.y,width:relem.width,height:relem.height,type:relem.type,data:relem.data,z:relem.z,locked:relem.locked});
    }
    newSlide.save(function(err, newSlide){
      if(err){
        res.send("error");
        return;
      }
      console.log(req.query.folder + " folder")
      Folder.findById(req.body.folder, function (err,folder){
        console.log(err);
        folder.slides.push(newSlide._id);
        folder.save();
      });
      res.send("ok");
    });
  }else if (req.body.edit == "true") {
    var res = res;
    Slide.findById(req.body.id, function(err, slide){
      slide.relems = [];
      slide.name = req.body.name;
      slide.user = req.user._id;
      slide.lastEdit = Date.now();
      for(var i in req.body.relems){
        var relem = req.body.relems[i];
        slide.relems.addToSet({x:relem.x,y:relem.y,width:relem.width,height:relem.height,type:relem.type,data:relem.data,z:relem.z,locked:relem.locked});
      }
      slide.save(function(err, newSlide){
        if(err){
          res.send("error:"+err);
          return;
        }
        res.send("ok");
      });
    });
  }else{
    Folder.find({user:req.user.id},function (err, folders){
      WindowModel.find({user:req.user._id},function (err, windowModels){
        res.render('create',{create:true,title:"Nouveau Slide",folders:folders,user:req.user,windowModels:windowModels});
      });
    });
  }
};