var fs = require('fs')
var url = require('url')
var gm = require('gm')

exports.index = function(req, res){
    if (req.query.get) {
        Poll.findById(req.query.get, function (err, poll) {
            if (err) {
                res.json(err);
                return;
            }
            res.json(poll);
        })
    } else if (req.query.vote) {
        if (!req.query.optionId) {
            res.json({error:"You must choose an option"});
            return;
        } else {
            Poll.findById(req.query.vote, function (err, poll) {
                if (err) {
                    res.json(err);
                    return;
                }
                var vote = {
                    date: new Date(), 
                    optionId: req.query.optionId
                };
                poll.votes.push(vote);
                poll.save(function (err, alteredPoll){
                    if (err){
                        res.json(err);
                        return;
                    }
                    res.send("OK");
                });
            })
        }
    } else {
        Poll.find({}, function (err, polls) {
            if (err) {
                res.json(err);
                return;
            }
            res.json(polls);
        });
    }
}