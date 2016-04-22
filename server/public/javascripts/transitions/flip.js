(function() {
    var transitionTime = 0.5;
    registerTransition('flip', {
        initializeTransition: function(oldDom, newDom) {
            $(oldDom).css({
                transform: 'perspective(600px) rotateY(0deg)',
                transition: 'transform ease-out ' + transitionTime + 's',
                backfaceVisibility: 'hidden',
                zIndex: 1
            })
            $(newDom).css({
                transform: 'perspective(600px) rotateY(180deg)',
                transition: 'none',
                backfaceVisibility: 'hidden',
                zIndex: 2
            });
        },
        startTransition: function(oldDom, newDom, next) {
            $(oldDom).css({
                transform: 'perspective(600px) rotateY(-180deg)',
            });
            $(newDom).css({
                transform: 'perspective(600px) rotateY(0deg)',
                transition: 'transform ease-out ' + transitionTime + 's',
            });
            setTimeout(next, transitionTime * 1000);
        }
    });
})();
