(function() {
    var transitionTime = 1;
    registerTransition('crossfade', {
        initializeTransition: function(oldDom, newDom) {
            $(newDom).css({
                visibility: 'hidden',
                zIndex: 2
            });
            $(oldDom).css("z-index", 1);
        },
        startTransition: function(oldDom, newDom, next) {
            $(newDom).css({
                opacity: 0,
                visibility: 'visible',
                transition: 'none'
            });
            $(newDom).animate({
                opacity: 1
            }, transitionTime * 1000 / 2, function (){
                $(oldDom).animate({
                    opacity: 0
                }, transitionTime * 1000 / 2, next);
            });
            // setTimeout(function (){
            //     $(newDom).css({
            //         transition: 'opacity ' + transitionTime + 's',
            //         opacity: 1
            //     })
            // }, 10);
            // setTimeout(next, transitionTime * 1000);
        }
    });
})();
