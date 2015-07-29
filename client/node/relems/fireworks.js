
//var execHandle = require('child_process').exec('vidplayer');

var nbRelems 	= 0;
var connected 	= false;

var net = require('net');

var client = new net.Socket();

function onSuccess(){
	console.log('[Fireworks] Connected to skyrocket');
	connected = true;    
}
function onError(){
    console.log("[Fireworks] Error connecting to skyrocket");
    setTimeout(function (){
        console.log("[Fireworks] Retrying connection...");
        client = new net.Socket();
        client.on("error",onError);
        client.connect(1338, '127.0.0.1', onSuccess);
    }, 20000);  
}

client.on('error', onError)
client.connect(1338, '127.0.0.1', onSuccess);

var hexToRgb = function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16)/255,
        g: parseInt(result[2], 16)/255,
        b: parseInt(result[3], 16)/255
    } : null;
}

exports.class = { 
    type	: 'Fireworks',
    cleared	: false,
    needRedraw	: true,
    firstDraw	: true,
    drawZone	: function(ctx,x,y,width,height){
        ctx.clearRect(x,y,width,height);
    },
    draw	: function(ctx){    
        ctx.clearRect(this.left,this.top,this.width,this.height);

        if(!this.cleared){
            this.cleared = true;
	    
            if(this.firstDraw){
                console.log("[Fireworks] Launch! "+this.data.type);
		
                if(connected){
                    var primaryColor = hexToRgb(this.data.primaryColor);
                    var secondaryColor = hexToRgb(this.data.secondaryColor);
                    var power = this.data.power/100;
                    var angle = this.data.angle;
                    var type = this.data.type;
                    var seed = this.data.seed;
                    
                    client.write(JSON.stringify({
                        primaryR:primaryColor.r,
                        primaryG:primaryColor.g,
                        primaryB:primaryColor.b,
                        secondaryR:secondaryColor.r,
                        secondaryG:secondaryColor.g,
                        secondaryB:secondaryColor.b,
                        power:power,
                        angle:angle,
                        type:type,
                        seed:seed
                    })+"\n");

                    this.needRedraw = false;
                    this.firstDraw = false;
                }
            }
        }
    },
    isReady	: false,
    load	: function(callback){
        this.isReady = true;
    },
    cleanup	: function()
    {
        console.log("[fireworks] Cleaning up");
   }
};
