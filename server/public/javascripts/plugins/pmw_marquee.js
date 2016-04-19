(function ( $ ){
    'use strict';
    $.fn.pmwMarquee = function ( options ){
        var updateDisplay = function () {
            console.log("update");
            this.css("transition", "none");
            this.css("transform", "translateX(" + containerWidth + "px)")
            setTimeout(function () {
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
        setInterval(updateDisplay, traverseTime + 500);
        setTimeout(function () {
            this.css("transition", "transform linear " + (traverseTime/1000) + "s");
            this.css("transform", "translateX(" + (-width) + "px)");
        }.bind(this), 500);
    };
}( jQuery ));