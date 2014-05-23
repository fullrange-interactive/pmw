
/*
 * Slide creator
 */
var config = require('../config');
 
 var fs = require('fs');

exports.index = function(req, res){
    res.header("Access-Control-Allow-Origin","*")
    if ( req.query.action == "purgeDB" ){
        console.log("convertDB");
        Drawing.find().execFind(function (error, drawings){
            console.log("found");
            for ( drawing in drawings ){
                //console.log(drawings[drawing]);
                var id = drawings[drawing]._id;
                if ( !fs.existsSync("drawings/" + id + ".json") )
                    continue;
                console.log("purging " + id);
                drawings[drawing].strokes = undefined;
                drawings[drawing].save(function (err){
                    if ( err )
                        console.log("error purging " + id);
                })
            }
            console.log("all done!");
        });
        return;
    }
    if ( req.body.action == "newDrawing" ){
        var newDrawing = new Drawing();
		console.log(req.body);
		if ( req.body.background ){
        	newDrawing.backgroundImage = "http://" + config.url + req.body.background;
		}else{
			newDrawing.backgroundColor = req.body.backgroundColor;
		}
        newDrawing.strokes = [];
        newDrawing.width = req.body.width;
        newDrawing.height = req.body.height;
        points = 0;
        var saveStrokes = [];
        for(var i in req.body.strokes){
            var stroke = {};
            stroke.color = req.body.strokes[i].color;
            stroke.lineWidth = req.body.strokes[i].lineWidth;
            stroke.points = [];
            for(var j in req.body.strokes[i].points){
                point = req.body.strokes[i].points[j];
                points++;
                stroke.points.push(point);
                //stroke.points.addToSet({x:point.x,y:point.y});
            }
            //newDrawing.strokes.addToSet(stroke);
            saveStrokes.push(stroke);
        }
        newDrawing.points = points;
        newDrawing.save(function(err, newDrawing){
            if(err){
                res.send("");
                console.log("Error writing drawing to DB " + err)
                return;
            }
            fs.writeFile("drawings/" + newDrawing._id + ".json", JSON.stringify(saveStrokes), function (err){
                if ( err ){
                    res.send("");
                    console.log("error saving drawing file " + err);
                }
            });
            res.send(JSON.stringify({responseType:'ok'}));
        });
    }else{
        if( req.query.type == 'new' ){
            Drawing.findOne({moderated:true,validated:true}, {}, { sort: { 'date' : -1 } }, function(err, drawing){
                res.header("Cache-Control", "no-cache, no-store, must-revalidate");
                res.header("Pragma", "no-cache");
                res.header("Expires", 0);
                fs.readFile("drawings/" + drawing._id + ".json", function (err, data){
                    if ( err ){
                        console.log("Could not open drawing " + drawing._id + " error:" + err);
                        res.send("");
                        return;
                    }
                    //drawing.sentOnce = true;
                    //drawing.save(function (){});
                    //drawing._id = undefined;
                    drawing = drawing.toObject();
                    drawing.strokes = JSON.parse(data);
                    res.send(JSON.stringify(drawing));
                });
                
            });
            return;
        }else if ( req.query.type == 'trueRandom' ){
            Drawing.random({moderated:true,validated:true}, function(err, drawing){
                res.header("Cache-Control", "no-cache, no-store, must-revalidate");
                res.header("Pragma", "no-cache");
                res.header("Expires", 0);
                fs.readFile("drawings/" + drawing._id + ".json", function (err, data){
                    if ( err ){
                        console.log("Could not open drawing " + drawing._id + " error:" + err);
                        res.send("");
                        return;
                    }
                    //drawing.sentOnce = true;
                    //drawing.save(function (){});
                    //drawing._id = undefined;
                    drawing = drawing.toObject();
                    drawing.strokes = JSON.parse(data);
                    res.send(JSON.stringify(drawing));
                });
                
            });
            return;
        }else if ( req.query.type == 'top' ){
            Drawing.random({moderated:true,validated:true,likes:{$gt:0}}, function(err, drawing){
                res.header("Cache-Control", "no-cache, no-store, must-revalidate");
                res.header("Pragma", "no-cache");
                res.header("Expires", 0);
                fs.readFile("drawings/" + drawing._id + ".json", function (err, data){
                    if ( err ){
                        console.log("Could not open drawing " + drawing._id + " error:" + err);
                        res.send("");
                        return;
                    }
                    //drawing.sentOnce = true;
                    //drawing.save(function (){});
                    //drawing._id = undefined;
                    drawing = drawing.toObject();
                    drawing.strokes = JSON.parse(data);
                    res.send(JSON.stringify(drawing));
                });
                
            });
            return;
        } else if ( req.query.type == 'random' ){
            Drawing.findOne({moderated:true, validated:true, sentOnce:false}, {}, {sort:{'date':1}}, function (err, drawing){
                if ( !drawing ){
                    Drawing.random({moderated:true,validated:true},function (err, drawing){
                        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
                        res.header("Pragma", "no-cache");
                        res.header("Expires", 0);
                        fs.readFile("drawings/" + drawing._id + ".json", function (err, data){
                            if ( err ){
                                console.log("Could not open drawing " + drawing._id + " error:" + err);
                                res.send("");
                                return;
                            }
                            //drawing.sentOnce = true;
                            //drawing.save(function (){});
                            //drawing._id = undefined;
                            drawing = drawing.toObject();
                            drawing.strokes = JSON.parse(data);
                            res.send(JSON.stringify(drawing));
                        });
                    });
                    return;
                }
                //drawing.sentOnce = true;
                //drawing.save(function (){});
                fs.readFile("drawings/" + drawing._id + ".json", function (err, data){
                    if ( err ){
                        console.log("Could not open drawing " + drawing._id + " error:" + err);
                        res.send("");
                        return;
                    }
                    //drawing._id = undefined;
                    drawing = drawing.toObject();
                    drawing.strokes = JSON.parse(data);
                    res.send(JSON.stringify(drawing));
                });
            });
        }else if ( req.query.id != undefined ){
            console.log("id="+req.query.id);
            var req = req;
            Drawing.findById(req.query.id, function (err, drawing){
                fs.readFile("drawings/" + drawing._id + ".json", function (err, data){
                    if ( err ){
                        console.log("Could not open drawing " + drawing._id + " error:" + err);
                        res.send("");
                        return;
                    }
                    if ( req.query.sentOnce != undefined )
                    {
                        drawing.sentOnce = true;
                        drawing.save(function(){});
                    }
                    //drawing._id = undefined;
                    drawing = drawing.toObject();
                    drawing.strokes = JSON.parse(data);
                    
                    res.send(JSON.stringify(drawing));
                });
            });
        }
    }
};