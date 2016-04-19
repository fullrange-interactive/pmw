function showAlert(text,color){
  var mainAlert = $("<div>")
  mainAlert.addClass("alert");
  mainAlert.addClass("alert-"+color);
  mainAlert.html(text)
  $("body").append(mainAlert);
  setTimeout(function (){
    mainAlert.fadeOut();
  },2000);
}

var transitions = [
    'none',
    'coverLeft',
    'coverTop',
    'coverRight',
    'coverBottom',
    'smoothLeft',
    'smoothTop',
    'smoothRight',
    'smoothBottom',
    'slideLeft',
    'slideTop',
    'slideRight',
    'slideBottom',
    'crossfade'
];

// definiting the base constructor for all classes, which will execute the final class prototype's initialize method if exists
var Class = function() {
    this.initialize && this.initialize.apply(this, arguments);
};
Class.extend = function(childPrototype) { // defining a static method 'extend'
    var parent = this;
    var child = function() { // the child constructor is a call to its parent's
        return parent.apply(this, arguments);
    };
    child.extend = parent.extend; // adding the extend method to the child class
    var Surrogate = function() {}; // surrogate "trick" as seen previously
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;
    for(var key in childPrototype){
        child.prototype[key] = childPrototype[key];
    }
    return child; // returning the child class
};

function getQueryParams(qs)
{
    qs = qs.split("+").join(" ");
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs))
    {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}