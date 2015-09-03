exports.serverStreamer = function (){
    var listeners = [];
    
    this.register = function (relem, callback){
        listeners.push({relem: relem, callback: callback.bind(relem)});
    };
    
    this.unregister = function (relem){
        for(var i = listeners.length-1; i >= 0; i--){
            if(listeners[i].relem == relem){
                listeners.splice(i,1);
                return;
            }
        }
    };
    
    this.onReceive = function(message){
        for(var i = 0; i < listeners.length; i++){
            listeners[i].callback(message);
        }
    };
};