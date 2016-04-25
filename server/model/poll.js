var mongoose = require('mongoose');

var Vote = mongoose.Schema({
    date: {type: Date, default: Date.now},
    optionId: Number
})

var PollOption = mongoose.Schema({
    optionId: Number,
    name: String,
    image: String
})

var PollSchema = mongoose.Schema({
    pollOptions: [PollOption],
    votes: [Vote],
    name: String,
    color: String
})

var Poll = mongoose.model('Poll', PollSchema);
module.exports = Poll;