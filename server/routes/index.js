/*
 * GET home page.
 */
Sequence = require('../model/sequence');

exports.index = function(req, res){
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
        }else if ( req.query.group && !req.query.groupSlide ){
            Manager.setGroupSlideForXY(req.query.slide,req.query.group,req.query.x,req.query.y,req.query.transition);
            res.redirect("/");
        } else if ( req.query.groupSequence ){
            Manager.setGroupSequenceForXY(req.query.sequence,req.query.groupSequence,req.query.x,req.query.y,req.query.loop);
            res.redirect("/");
        } else if ( req.query.groupAutomator ){
            AutomatorManagerInstance.SetAutomatorForGroup(req.query.automator, req.query.groupAutomator);
            res.redirect("/");
        } else if ( req.query.groupSlide ){
            AutomatorManagerInstance.AddSlideToGroupQueue(req.query.groupSlide, req.query.group);
            res.send("OK");
        } else if ( req.query.removeAutomatorGroup ){
            AutomatorManagerInstance.RemoveAutomatorForGroup(req.query.removeAutomatorGroup);
            res.redirect("/");
        }else if ( req.query.newFolder ){
            console.log("new folder " + req.query.newFolder)
            var newFolder = new Folder();
            newFolder.name = req.query.newFolder;
            newFolder.user = req.user._id;
            newFolder.save();
        } else if ( req.query.slideInFolder ){
            Slide.findById(req.query.slide,function (err, slide){
                Folder.find(function (err,folders){
                    for(var i = 0; i < folders.length; i++ ){
                        for ( var j = 0; j < folders[i].slides.length; j++ ){
                            if ( folders[i].slides[j].toString() ==  slide._id.toString() ){
                                folders[i].slides.splice(j,1);
                                folders[i].save();
                                return;
                            }
                        }
                    }
                });
            });
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
            Automator.find({user:req.user._id}).sort({name:1}).execFind(function (err, automators){
                Sequence.find({user:req.user._id}).sort({name:1}).execFind(function (err, sequences){
                    WindowGroup.find({user:req.user._id}).populate('windows.window windows.groupSlide automator').execFind(function (err, windowGroups){
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
                        var pageData = {title: "Supervision", automatorManager: AutomatorManagerInstance, automators: automators, slides: slides, groups:windowGroups, sequences:sequences, user:req.user,req:req}
                        if ( req.query.justData ){
                            var newData = {
                                automatorManager:{
                                    windowGroupWorkers: {}
                                },
                                groups: windowGroups
                            };
                            for(var i in AutomatorManagerInstance.windowGroupWorkers){
                                var worker = AutomatorManagerInstance.windowGroupWorkers[i];
                                newData.automatorManager.windowGroupWorkers[i] = {
                                    elementsQueue:{
                                        length: worker.elementsQueue.length
                                    }
                                }
                            }
                            res.send(JSON.stringify(newData));
                        }else{
                            res.render('index', pageData);
                        }
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
            });
        }
    });
};