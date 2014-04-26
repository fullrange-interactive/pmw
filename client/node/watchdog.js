 
exports.watchdog = 
{
  listenHost            : '0.0.0.0',
  listenPort            : 8082,
  sendHost              : '',
  sendPort              : 8081,
  lastServerActivity    : 0,
  serverTimeout         : true,
  timeout               : 2000,
  sendIntervalTime      : 500,
  checkIntervalTime     : 500,
  initialize            : function(
      windowId,
      serverIp,
      functIsActive,
      functReconnect,          // Reconnexion callback
      functKill                // Connexion Kill callback
  )
  {
      this.windowId             = windowId;
      this.sendHost             = serverIp;
      this.connxIsActive        = functIsActive;
      this.connxReconnect       = functReconnect;
      this.connxKill            = functKill;
      
      console.log("[Watchdog] WindowId : "+windowId+" Server: "+this.sendHost);
      
      this.UDPserver                      = require("dgram").createSocket("udp4");
      this.UDPserver.lastServerActivity   = new Date().getTime();
      
      this.UDPserver.on("message",this.onMessage);
      
      this.UDPserver.bind( this.listenPort, this.listenHost );
      
      var that = this;
      
      setInterval(function(){that.intervalSend();},this.sendIntervalTime);
      setInterval(function(){that.intervalCheck();},this.checkIntervalTime);
            
      return this;
  },
  onMessage             : function(msg, rinfo)
  {
      this.lastServerActivity = new Date().getTime();
  },
  intervalSend          : function()
  {
    var message = new Buffer(""+this.windowId);
    try
    {
        require("dgram").createSocket("udp4").send(message, 0, message.length, this.sendPort, this.sendHost);
    }
    catch(e){}
  },
  intervalCheck         : function()
  {
    var lastActivity = (new Date().getTime()) - this.UDPserver.lastServerActivity;

    if(!this.serverTimeout && (!this.connxIsActive() || lastActivity > this.timeout))
    {
        this.serverTimeout = true;
        console.log("[Watchdog] Server timeout");
        
        if(this.connxIsActive())
        {
            console.log("[Watchdog] Killing connection");
            try
            {
                this.connxKill();
            }
            catch(e){}
        }
    }
    else if(lastActivity <= this.timeout)
    {
        if(this.serverTimeout)
        {
           console.log("[Watchdog] Reconnection");
           this.serverTimeout = false;   
           this.connxReconnect();
        }
        
    }
  }
};