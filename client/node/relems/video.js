//var execHandle = require('child_process').exec('vidplayer');

var nbRelems = 0;


exports.class = {
  type: 'Video',
  cleared: false,
  transitionEnded: false,
  needRedraw: true,
  firstDraw: true,
  sameCanvas: false,
  killing: false,
  connected:false,
  client:null,
  fileName: '',
  transitionEnded:false,
  drawZone: function(ctx, x, y, width, height)
  {
    ctx.clearRect(x, y, width, height);
  },
  draw: function(ctx)
  {
    if (!this.transitionEnded)
      ctx.clearRect(this.left, this.top, this.width, this.height);

    if (!this.cleared)
    {
      this.cleared = true;

      if (this.firstDraw)
      {
        setTimeout((function()
        {
          this.transitionEnded = true;
        }).bind(this), 3000);

        ctx.clearRect(this.left, this.top, this.width, this.height);

        console.log("[vidplayer] Play! " + this.fileName);

        this.client.write(JSON.stringify(
        {
          command: "play",
          fileName: this.fileName
        }) + "\n");        

        this.needRedraw = false;
        this.firstDraw = false;
      }
    }
  },
  isReady: false,
  downloadMedia: function(callback)
  {
    console.log('Connected to vidplayer');
    this.connected = true;

    this.requestId = MediaServer.requestMedia(
      this.data.url,
      'url',
      (function(data)
      {
        if (!this.aborted)
        {
          console.log("[Video] Downloaded: " + data);

          this.fileName = data;

          if(this.connected)
          {
            this.isReady = true;
            callback();
          }
        }
      }).bind(this),
      (function(data)
      {
        this.isReady = true;
        callback();
      }).bind(this)
    );
  },
  load: function(callback)
  {
    nbRelems++;

    var net = require('net');

    this.client = new net.Socket();

    this.client.on("error", function(error)
    {
      console.log("Error connecting to vidplayer");

      this.connected = false;

      if(!this.killing)
        setTimeout(this.client.connect(1337, '127.0.0.1',(function(){this.downloadMedia(callback)}).bind(this)),5000);

    });

    this.client.connect(1337, '127.0.0.1',(function(){this.downloadMedia(callback)}).bind(this));    
  },
  cleanup: function()
  {
    if (this.killing)
      return;

    this.killing = true;

    if (this.connected)
    {
      nbRelems--;

      if(nbRelems==0)
      {
        console.log("[vidplayer] Stopping vidplayer");        
        this.client.write(JSON.stringify({command: "pause"}) + "\n");
      }
      this.connected = false;
    }

    this.client.end();
    
    console.log("[vidplayer] Quit");

    //         this.omx.quit();
  }
};
