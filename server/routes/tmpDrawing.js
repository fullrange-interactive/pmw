
/*
 * Slide creator
 */
var config = require('../config');
 
 var fs = require('fs');

exports.index = function(req, res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Content-Type");
    if (req.body.strokes) {
        fs.writeFile("public/tmp-drawings/drawing.json", JSON.stringify(req.body), function (err) {
            if (err) {
                res.status(500).send('Error');
                return;
            }
            res.send('ok');
        });
    } else {
        res.end();
    }
};