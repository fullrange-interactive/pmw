/*
 * GET home page.
 */
Sequence = require('../model/sequence');

exports.index = function(req, res){
	if ( req.query.putInFolder ){
		Folder.findById("537765d7a5f442149300000c",function (err, folder){
			Slide.find({user:req.user.id},function (err, slides){
				for(var i in slides){
					var slide = slides[i];
					console.log(slide);
					folder.slides.push(slide._id);
					folder.save();
				}
			});
		});
	}
    if ( req.query ){
        if ( req.query.deleteSlide ){
            Slide.findByIdAndRemove(req.query.deleteSlide,function(err){
                if(err){
                    res.send("could not delete");
                    return;
                }
            });
			Folder.find(function (err, folders){
				for(var i = 0; i < folders.length; i++ ){
					var folder = folders[i];
					for ( var j = 0; j < folder.slides.length; j++ ){
						if ( folder.slides[j].toString() == req.query.deleteSlide ){
							folder.slides.splice(j,1);
							folder.save();
							return;
						}
					}
				}
			})
        }else if ( req.query.deleteSequence ){
            Sequence.findByIdAndRemove(req.query.deleteSequence,function(err){
                if(err){
                    res.send("could not delete");
                    return;
                }
            });
        }else if ( req.query.group ){
			Manager.setGroupSlideForXY(req.query.slide,req.query.group,req.query.x,req.query.y);
			res.redirect("/");
        } else if ( req.query.groupSequence ){
			Manager.setGroupSequenceForXY(req.query.sequence,req.query.groupSequence,req.query.x,req.query.y);
			res.redirect("/");
        } else if ( req.query.newFolder ){
			console.log("new folder " + req.query.newFolder)
        	var newFolder = new Folder();
			newFolder.name = req.query.newFolder;
			newFolder.user = req.user._id;
			newFolder.save();
        } else if ( req.query.slideInFolder ){
        	Folder.findById(req.query.folder,function(err, folder){
        		folder.slides.push(req.query.slide);
				folder.save();
        	});
        }
    }
    Slide.find({user:req.user._id}).populate('windowModel').sort({name:1}).execFind(function(err, slides){
        if ( err ){
            res.render('error', {title: 'Error'});
        }else{
			Sequence.find({user:req.user._id}).sort({name:1}).execFind(function (err, sequences){
				WindowGroup.find({user:req.user._id}).populate('windows.window windows.groupSlide').execFind(function (err, windowGroups){
					//We'll just be adding some extra markup for jade
					for( var i in windowGroups ){
						var maxX = 0;
						var maxY = 0;
						for( var j in windowGroups[i].windows ){
							if ( windowGroups[i].windows[j].x > maxX )
								maxX = windowGroups[i].windows[j].x;
							if ( windowGroups[i].windows[j].y > maxY )
								maxY = windowGroups[i].windows[j].y;
						}
						windowGroups[i]['width'] = maxX + 1;
						windowGroups[i]['height'] = maxY + 1;
					}
					res.render('index', {title: "Supervision", slides: slides, groups:windowGroups, sequences:sequences, user:req.user,req:req});
					/*
					Window.find({user:req.user._id}).sort({windowId:1}).execFind(function (err, dbwindows){
						for(var i in windows){
							for(var j in dbwindows){
								if ( dbwindows[j].windowId == windows[i].windowId ){
									dbwindows[j].connected = windows[i].connected;
									dbwindows[j].privateIp = windows[i].privateIp;
								}
							}
						}
						//console.log("===" + JSON.stringify(dbwindows));
						res.render('index', {title: "Supervision", slides: slides, wins:dbwindows, sequences:sequences, user:req.user});
					});
					*/
				});
			});
        }
    });
};