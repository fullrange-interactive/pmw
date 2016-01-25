
/*
 * GET users listing.
 */
WindowModel = require('../model/windowModel');

exports.index = function (req, res){
    windowMod
    res.render('user',{user:req.user,windowMod})
}