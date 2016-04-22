var Transition = Class.extend({
    type: 'default',
    cancelled: false,
    initialize: function() {

    },
    initializeTransition: function(oldDom, newDom) {
        $(newDom).css({visibility: 'none'});
    },
    startTransition: function(oldDom, newDom, next) {
        $(newDom).css({visibility: 'visible'});
        next();
    },
    cancelTransition: function (){
        this.cancelled = true;
    }
})

var transitions = {};

var registerTransition = function(name, ctor) {
    transitions[name] = Transition.extend(ctor);
}
