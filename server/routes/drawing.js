
/*
 * Slide creator
 */

exports.index = function(req, res){
    if ( req.query.action == "convertDB" ){
        
    }
    if ( req.body.action == "newDrawing" ){
        var newDrawing = new Drawing();
        newDrawing.backgroundColor = req.body.backgroundColor;
        newDrawing.strokes = [];
        newDrawing.width = req.body.width;
        newDrawing.height = req.body.height;
        points = 0;
        for(var i in req.body.strokes){
            var stroke = new Stroke();
            stroke.color = req.body.strokes[i].color;
            stroke.lineWidth = req.body.strokes[i].lineWidth;
            stroke.points = [];
            for(var j in req.body.strokes[i].points){
                point = req.body.strokes[i].points[j];
                points++;
                stroke.points.addToSet({x:point.x,y:point.y});
            }
            newDrawing.strokes.addToSet(stroke);
        }
        newDrawing.points = points;
        newDrawing.save(function(err, newDrawing){
            if(err){
                res.send("");
                return;
            }
            res.send(JSON.stringify({responseType:'ok'}));
        });
    }else{
        if( req.query.type == 'new' ){
            Drawing.findOne({moderated:true,validated:true}, {}, { sort: { 'date' : -1 } }, function(err, drawing){
                res.header("Cache-Control", "no-cache, no-store, must-revalidate");
                res.header("Pragma", "no-cache");
                res.header("Expires", 0);
                drawing._id = undefined;
                for(var i in drawing.strokes){
                    for(var j in drawing.strokes[i].points){
                        drawing.strokes[i].points[j]._id = undefined;
                    }
                    drawing.strokes[i]._id = undefined;
                }
                res.send(JSON.stringify(drawing));
            });
            return;
        }else if ( req.query.type == 'random' ){
            Drawing.random({moderated:true,validated:true},function (err, drawing){
                res.header("Cache-Control", "no-cache, no-store, must-revalidate");
                res.header("Pragma", "no-cache");
                res.header("Expires", 0);
                drawing._id = undefined;
                for(var i in drawing.strokes){
                    for(var j in drawing.strokes[i].points){
                        drawing.strokes[i].points[j]._id = undefined;
                    }
                    drawing.strokes[i]._id = undefined;
                }
                res.send(JSON.stringify(drawing));
            });
        }else if ( req.query.id != undefined ){
            console.log("id="+req.query.id);
            Drawing.findById(req.query.id, function (err, drawing){
                drawing._id = undefined;
                for(var i in drawing.strokes){
                    for(var j in drawing.strokes[i].points){
                        drawing.strokes[i].points[j]._id = undefined;
                    }
                    drawing.strokes[i]._id = undefined;
                }
                res.send(JSON.stringify(drawing));
            });
        }
    }
};