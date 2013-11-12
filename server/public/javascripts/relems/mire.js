var Mire = rElem.extend({
    isReady:false,
    type:'Mire',
    displayLayer: function ( dom ) {
        return '<div rElemID="' + this.instanceName + '"> mire </div>';
    },
    load:function(callback){
        console.log("["+this.instanceName+" Mire] load ");
        this.createDom();
        $(this.viewPort).css({backgroundImage:'url(testimages/mire.jpg)',backgroundSize:'cover',backgroundPosition:'50% 50%'});
        callback();
    }    
});

