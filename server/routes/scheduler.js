
/*
 * Slide creator
 */
var config = require('../config');
var scheduler = require('../modules/scheduler');
 
var fs = require('fs');


exports.index = function(req, res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Content-Type");
    if (req.body.schedule) {
        scheduler.updateSchedule(req.body.schedule, function (error) {
            var asText = scheduler.asText();
            if (error)
                asText = req.body.schedule;
            res.render('scheduler', {title: "Scheduler", schedule: asText, user: req.user, page:req.query.page, error: error, done: true});
        });
    } else {
        res.render('scheduler', {title: "Scheduler", schedule: scheduler.asText(), user: req.user, page:req.query.page});
    }
};