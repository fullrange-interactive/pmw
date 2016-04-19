(function ( $ ){
    'use strict';
    $.fn.pmwMarquee = function ( options ){
        var updateDisplay = function () {
            console.log("update marquee");
            this.css("transition", "none");
            this.css("transform", "translateX(" + containerWidth + "px)")
            timeout = timeout = setTimeout(function () {
                this.css("transition", "transform linear " + (traverseTime/1000) + "s");
                this.css("transform", "translateX(" + (-width) + "px)");
            }.bind(this), 500);
        }.bind(this);
        // Convert this bitch into a marquee
        var width = this.width();
        var containerWidth = this.parent().width();
        var x = containerWidth;
        var traverseTime = 1000 * (containerWidth + width) / (options.speed * 40);
        this.css("transform", "translateX(" + x + "px)")
        var interval = setInterval(updateDisplay, traverseTime + 500);
        var timeout = setTimeout(function () {
            this.css("transition", "transform linear " + (traverseTime/1000) + "s");
            this.css("transform", "translateX(" + (-width) + "px)");
        }.bind(this), 500);
        this.data({"interval": interval, "timeout": timeout});
    };
    $.fn.stopPmwMarquee = function (){
        var data = this.data();
        clearInterval(data.interval);
        clearTimeout(data.timeout);
    }
}( jQuery ));