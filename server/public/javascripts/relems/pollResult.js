function makeFloat(elem, angleOffset) {
    var val = parseFloat($(elem).attr("sin"));
    angleOffset = angleOffset || 0;
    $(elem).css({
        transform: 'rotate(' + (Math.sin(val)*1.2 + angleOffset) + 'deg) translate(' + (3 * Math.cos(val/2)) + 'px,' + (4.2 * Math.sin(val/3.5)) + 'px)'
    });
    val += 0.03;
    $(elem).attr("sin", val);
}

var PollResult = rElem.extend({
    type: 'PollResult',
    isReady: false, 
    optionDoms: [],
    destroyed: false,
    load: function (callback) {
        this.createDom();

        if (this.data.pollId) {
            $.get("/poll", {get: this.data.pollId}, function(poll) {
                callback();

                $(this.viewPort).addClass("poll-result");

                var title = $("<h1>").html(poll.name).attr("sin", 0);
                $(this.viewPort).append(title);

                var remainingHeight = $(this.viewPort).height() - title.height();
                var resultHeight = remainingHeight / poll.pollOptions.length - 5;

                var counts = {};
                var total = 0;
                for (var i in poll.votes) {
                    if (typeof counts[poll.votes[i].optionId] === 'undefined')
                        counts[poll.votes[i].optionId] = 1;
                    else
                        counts[poll.votes[i].optionId]++;
                    total++;
                }

                for (var i in poll.pollOptions) {
                    var pollOption = poll.pollOptions[i];
                    var optionResult = $("<div>").addClass("option-result");
                    optionResult.css({
                        height: resultHeight + 'px'
                    });
                    $(this.viewPort).append(optionResult);

                    if (pollOption.image) {
                        var photo = $("<div>").addClass("option-image");
                        photo.css({
                            backgroundImage: 'url(' + pollOption.image + ')',
                            backgroundSize: 'cover',
                            backgroundPosition: '50% 50%',
                            width: resultHeight + 'px'
                        })
                        photo.attr("sin", Math.random() * Math.PI);
                        optionResult.append(photo);
                    }

                    if (pollOption.name) {
                        var name = $("<div>").addClass("option-name");
                        name.html(pollOption.name);
                        name.css({
                            width: resultHeight + 'px',
                            transform: 'rotate(-90deg)',
                            top: '50%',
                            left: (resultHeight / 2 + resultHeight / 5 + 5) + 'px',
                            fontSize: (resultHeight / 5) + 'px',
                            marginTop: (-resultHeight / 10) + 'px',
                            color: pollOption.color
                        })
                        name.attr("sin", Math.random() * 300);
                        optionResult.append(name);
                    }

                    if (this.data.light)
                        return;

                    var bar = $("<div>").addClass("option-bar");
                    bar.attr("option-id", pollOption.optionId);
                    bar.css({
                        width: 0,
                        lineHeight: resultHeight + 'px',
                        left: (resultHeight + resultHeight / 5) + 'px',
                        backgroundColor: pollOption.color,
                        fontSize: resultHeight / 5 + 'px'
                    })
                    setTimeout(function (bar, pollOption){
                        var availableWidth = $(this.viewPort).width() - resultHeight - resultHeight / 5 - 20;
                        var barWidth =  availableWidth * (counts[pollOption.optionId] / total);
                        if (barWidth < availableWidth/15)
                            barWidth = availableWidth/15
                        bar.css({
                            width: (barWidth) + 'px'
                        });
                        // bar.html(Math.round(100 * counts[pollOption.optionId] / total) + '%');
                        bar.attr("sin", Math.random() * 200)
                        bar.attr("option-id", pollOption.optionId);
                        bar.attr("available-width", availableWidth);
                    }.bind(this, bar, pollOption), 10)
                    optionResult.append(bar);

                    if (!this.data.light){
                        this.floatInterval = setInterval(this.float.bind(this), 30);
                        this.refreshInterval = setInterval(this.refreshData.bind(this), 5000);
                    }
                }
            }.bind(this));
        } else {
            $(this.viewPort).html("No poll defined");
            callback();
        }
    },
    refreshData: function() {
        $.get("/poll", {get: this.data.pollId}, function (poll){
            var counts = {};
            var total = 0;
            for (var i in poll.votes) {
                if (typeof counts[poll.votes[i].optionId] === 'undefined')
                    counts[poll.votes[i].optionId] = 1;
                else
                    counts[poll.votes[i].optionId]++;

                total++;
            }
            for (var i in poll.pollOptions) {
                var pollOption = poll.pollOptions[i];
                var bar = $(this.viewPort).find(".option-bar[option-id=" + pollOption.optionId + "]");
                var availableWidth = bar.attr("available-width");
                var barWidth =  availableWidth * (counts[pollOption.optionId] / total);
                if (barWidth < availableWidth/15)
                    barWidth = availableWidth/15
                bar.css({
                    width: (barWidth) + 'px'
                });
                // bar.html(Math.round(100 * counts[pollOption.optionId] / total) + '%');
                bar.attr("sin", Math.random() * 200)
            }
        })
    },
    float: function () {
        makeFloat($(this.viewPort).find("h1"));
        $(this.viewPort).find(".option-image").each(function (elem){
            makeFloat(this);
        });
        $(this.viewPort).find(".option-name").each(function (elem){
            makeFloat(this, -90);
        });
        $(this.viewPort).find(".option-bar").each(function (elem){
            makeFloat(this);
        });
    },
    cleanup: function () {
        // console.log("CLEAN");
        if (!this.destroyed && !this.data.light) {
            clearInterval(this.floatInterval);
            clearInterval(this.refreshInterval);
            this.destroyed = true;
            $(this.viewPort).remove();
        }
    }
});
