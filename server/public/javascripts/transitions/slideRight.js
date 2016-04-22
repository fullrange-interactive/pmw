(function() {
    var transitionTime = 0.2;
    registerTransition('slideRight', {
        initializeTransition: function(oldDom, newDom) {
            $(oldDom).css({
                transition: 'transform ease-out ' + transitionTime + 's'
            });
            $(newDom).css({
                transition: 'none',
                'transform': 'translateX(-' + $(oldDom).width() + 'px)'
            });
        },
        startTransition: function(oldDom, newDom, next) {
            $(oldDom).css({
                transform: 'translateX(' + $(oldDom).width() + 'px)'
            });
            $(newDom).css({
                transition: 'transform ease-out ' + transitionTime + 's',
                transform: 'translateX(0px)'
            });
            setTimeout(next, transitionTime * 1000);
        }
    });
})();
