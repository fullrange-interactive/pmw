(function() {
    var transitionTime = 0.5;
    var scale = 6;
    registerTransition('scaleFade', {
        initializeTransition: function(oldDom, newDom) {
            $(oldDom).css({
                transition: 'all ease-out ' + transitionTime + 's',
                zIndex: 1
            });
            $(newDom).css({
                transition: 'none',
                transform: 'scale(' + scale + ')',
                opacity: '0',
                zIndex: 2
            });
        },
        startTransition: function(oldDom, newDom, next) {
            $(oldDom).css({
                transform: 'scale(' + (1 / scale) + ')'
            });
            $(newDom).css({
                transition: 'all ease-out ' + (transitionTime/2) + 's',
                transform: 'scale(1)',
                opacity: 1
            });
            setTimeout(function (){
                $(oldDom).css({
                    opacity: 0
                })
                setTimeout(next, transitionTime * 1000 / 2);
            }, transitionTime * 1000 / 2);
        }
    });
})();
