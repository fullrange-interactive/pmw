/*global pmw, $*/

pmw.Controllers = pmw.Controllers || {};

(function (global) {
    'use strict';


    function shuffle(o) {
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

    pmw.Controllers.PollController = pmw.Controllers.AbstractController.extend({

        pageHeadline: "Voter",
        polls: null,

        _initViews: function () {
            backRoute = "#";
            // Create the ContentView with the controller (this) as scope
            if (!this.contentView) {
                this.contentView = pmw.Views.PollView.create(this, null, true);
            }

            // Create the HeaderView with the controller (this) as scope
            if (!this.headerView) {
                this.headerView = pmw.Views.BackheaderView.create(this, null, true);
            }

            this._applyViews();

            if (window.location.hash === '#clearAll'){
                docCookies.removeAll();
            }

            $.get(global.pmw.options.serverUrl + "/poll", {
                listImages: 1
            }, function (data) {
                this.polls = data;
                this.fillPolls();
            }.bind(this), 'json');
        },
        fillPolls: function () {
            for (var i in this.polls) {
                var poll = this.polls[i];

                var pollElement = $("<div>").attr("poll-id", poll._id);
                pollElement.addClass("poll");

                var titleElement = $("<h1>").addClass("poll-title").html(poll.name);
                pollElement.append(titleElement);

                poll.pollOptions = shuffle(poll.pollOptions);

                for (var j in poll.pollOptions) {
                    var pollOption = poll.pollOptions[j];

                    var pollOptionElement = $("<div>").attr("option-id", pollOption.optionId);
                    pollOptionElement.addClass("poll-option clickable options-count-" + poll.pollOptions.length);
                    pollOptionElement.css({
                        backgroundImage: 'url(' + pollOption.image + ')',
                        borderColor: pollOption.color,
                        color: pollOption.color
                    });
                    pollOptionElement.on('tap click', this.castVote.bind(this, poll._id, pollOption.optionId));

                    var pollOptionNameElement = $("<div>").html(pollOption.name);
                    pollOptionNameElement.addClass("poll-option-name");
                    pollOptionNameElement.css({
                        backgroundColor: pollOption.color
                    })
                    pollOptionElement.append(pollOptionNameElement);

                    pollElement.append(pollOptionElement);
                }

                if (docCookies.hasItem("voted-" + poll._id)) {
                    pollElement.addClass("voted");
                    pollElement.find(".poll-option[option-id=" + docCookies.getItem("voted-" + poll._id) + "]").addClass("vote");
                    pollElement.find(".poll-option").unbind("tap click").removeClass("clickable");
                }

                $("#polls").append(pollElement);
            }
        },
        castVote: function (pollId, optionId) {
            console.log("Voted on " + pollId + " " + optionId);
            $(".poll[poll-id=" + pollId + "]").addClass("voted");
            $(".poll[poll-id=" + pollId + "] .poll-option[option-id=" + optionId + "]").addClass("vote");
            $(".poll[poll-id=" + pollId + "] .poll-option").unbind("tap click").removeClass("clickable");
            $.ajax({
                url: global.pmw.options.serverUrl + "/poll",
                type: 'get',
                data: {
                    vote: pollId,
                    optionId: optionId
                },
            }).done(function (data) {
                if (data === "OK") {
                    docCookies.setItem("voted-" + pollId, optionId, Infinity);
                }
            });
        }
    });

})(this);
