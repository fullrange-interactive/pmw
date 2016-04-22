(function() {
    var transitionTime = 0.2;
    registerTransition('slideBottom', {
        initializeTransition: function(oldDom, newDom) {
            $(oldDom).css({
                transition: 'transform ease-out ' + transitionTime + 's'
            });
            $(newDom).css({
                transition: 'none',
                'transform': 'translateY(-' + $(oldDom).width() + 'px)'
            });
        },
        startTransition: function(oldDom, newDom, next) {
            $(oldDom).css({
                transform: 'translateX(' + $(oldDom).width() + 'px)'
            });
            $(newDom).css({
                transition: 'transform ease-out ' + transitionTime + 's',
                transform: 'translateY(0px)'
            });
            setTimeout(next, transitionTime * 1000);
        }
    });
})();
