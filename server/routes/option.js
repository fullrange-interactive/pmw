/*
 * GET slide.
 */

exports.index = function(req, res){
    res.header("Access-Control-Allow-Origin","*")
    if ( req.query.name ){
        Option.find({name:req.query.name},function (err, option){
            if ( err ){
                return;
            }
            res.json(option[0]);
        });
    } else {
        res.send('');
    }
};