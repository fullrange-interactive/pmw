
exports.watchdog = 
{
  listenHost            : '0.0.0.0',
  listenPort            : 8082,
  sendHost              : '0.0.0.0',
  sendPort              : 8081,
  lastServerActivity    : 0,
  serverTimeout         : false,
  timeout               : 2000,
  sendIntervalTime      : 500,
  checkIntervalTime     : 500,
  initialize            : function(
      windowId,
      serverIp,
      functIsActive,
      functReconnect,           // Reconnexion callback
      functKill                // Connexion Kill callback
           
  )
  {
      this.windowId             = windowId;
      this.sendHost             = serverIp;
      this.connxIsActive        = functIsActive;
      this.connxReconnect       = functReconnect;
      this.connxKill            = functKill;
      
      this.lastServerActivity   = new Date().getTime();
      
      this.UDPserver            = require("dgram").createSocket("udp4");
      
      this.UDPserver.on("message",this.onMessage);
      
      this.UDPserver.bind( this.listenPort, this.listenHost );
      
      var that = this;
      
      setInterval(function(){that.intervalSend(that);},this.sendIntervalTime);
      setInterval(function(){that.intervalCheck(that);},this.checkIntervalTime);
      
      return this;
  },
  onMessage             : function(msg, rinfo)
  {
      this.lastServerActivity = new Date().getTime();
  },
  intervalSend          : function(ctx)
  {
    var message = new Buffer(ctx.windowId);
    this.UDPserver.send(message, 0, message.length, ctx.sendPort, ctx.serverIp);
  },
  intervalCheck         : function(ctx)
  {
    var lastActivity = (new Date().getTime() - ctx.lastServerActivity);

    if(lastActivity > ctx.timeout && !ctx.serverTimeout)
    {
        ctx.serverTimeout = true;
        console.log("[Watchdog] Server timeout");
        
        if(ctx.connxIsActive())
        {
            console.log("[Watchdog] Killing connection");
            ctx.connxKill();
        }
    }
    else if(lastActivity <= ctx.timeout)
    {
        if(ctx.serverTimeout)
        {
           console.log("[Watchdog] Reconnection");
           ctx.serverTimeout = false;   
           ctx.connxReconnect();
        }
        
    }
  }
};