
//var execHandle = require('child_process').exec('vidplayer');

var nbRelems 	= 0;
var connected 	= false;

var net = require('net');

var client = new net.Socket();
client.connect(1337, '127.0.0.1', function() {
	console.log('Connected to vidplayer');
	connected = true;
});

exports.class = { 
    type	: 'Video',
    cleared	: false,
    needRedraw	: true,
    firstDraw	: true,
    sameCanvas	: false,
    killing	: false,
    fileName	: '',
    drawZone	: function(ctx,x,y,width,height)
    {
        ctx.clearRect(x,y,width,height);
    },
    draw	: function(ctx)
    {    
        ctx.clearRect(this.left,this.top,this.width,this.height);

        if(!this.cleared)
        {
            this.cleared = true;
	    
            if(this.firstDraw)
	    {
		console.log("[vidplayer] Play! "+this.fileName);
		
		if(connected)
		  client.write(JSON.stringify({
		      commandId:0,
		      command:"play",
		      fileName:this.fileName  
		  })+"\n");
			      
                this.needRedraw = false;
                this.firstDraw = false;
            }
        }
    },
    isReady	: false,
    load	: function(callback){

        var that        = this;

        this.requestId = MediaServer.requestMedia(
	    
            that.data.url,
	    'url',
            function(data)
            {
	        if(!that.aborted)
                {
        		console.log("[Video] Downloaded: "+data);
			
			that.fileName = data;
			
			nbRelems++;
       
         	   	that.isReady = true;
         	   	callback();
		}
	});
    },
    cleanup	: function()
    {
        if(this.killing)
            return;
        
        this.killing = true;
        console.log("[vidplayer] Stopping vidplayer");

	nbRelems--;
	
	if(nbRelems == 0 && connected)
	{
	  client.write(JSON.stringify({
	      commandId : 1,
	      command	: "pause",
	      fileName	: this.fileName  
	  })+"\n");
	}	
        console.log("[vidplayer] Quit");
	
//         this.omx.quit();
   }
};
