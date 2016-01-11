exports.mediaServer = function()
{ 
  this.createRequest = function(urlString,fileName,type,callbackSuccess,callbackError,thisTicket)
  {
    var exec	= require('child_process').exec;
	
    var that = this;
	

    child = exec('wget "'+urlString+'" -q -O'+fileName,
    function (error, stdout, stderr) 
    {
      if (error !== null) {
        console.log('exec error: ' + error);
        callbackError('req error',0);
      }
      else
      {
        if(type=='data')
        {
          fs.readFile(fileName,{},function(err,data)
          {
            if(err)
            {
              console.log("[mediaServer.createRequest][readfile] error reading file "+fileName+". Error:"+err);

              callbackError('read error',0);
            }
            else
              callbackSuccess(data);
	
          });
        }
        else
        {
          console.log("[mediaServer] giving url "+fileName);
          callbackSuccess(fileName);
        }
      }
      that.removeRequest(thisTicket);
    });

  }
  /*
  * Request media
  */
  this.requestMedia = function(urlString,type,callbackSuccess,callbackError)
  {       
    var thisTicket  = ticket++;
    var that = this;
		
    var fileName	= '/tmp/media_'+crypto.createHash('md5').update(urlString).digest('hex');	
	
    if(fs.existsSync(fileName))
    {
      console.log("[mediaServer.requestMedia] File is in cache, not downloading it");
	  
      if(type=='data')
      {
        fs.readFile(fileName,{},function(err,data)
        {
          if(err)
          {
            console.log("[mediaServer.createRequest][readfile] error reading file "+fileName+". Error:"+err);

            callbackError('read error',0);
          }
          else
          {
            callbackSuccess(data);
          }

        });
      }
      else
      {
        console.log("[mediaServer] giving url "+fileName);
        callbackSuccess(fileName);
      }
      return thisTicket;	    
    }
        
        
    if(runningRequests == maxRequests)
    {
      requests.push({
        id      :thisTicket,
        req     :function(){that.createRequest(urlString,fileName,type,callbackSuccess,callbackError,thisTicket);},
        running :false});
            
        console.log("[mediaServer.requestMedia] Getting "+urlString+" queued");
        return thisTicket;
      }
        
      console.log("[mediaServer.requestMedia] Getting "+urlString+" immediately");
        
      runningRequests++;
    
      requests.push({
        id          :thisTicket,
        request     :that.createRequest(urlString,fileName,type,callbackSuccess,callbackError,thisTicket),
        running     :true});
        
        return thisTicket;
      };
      /*
      * Abort pending request
      */
      this.abort  =       function(id)
      {
        console.log("[mediaServer.abort][request "+id+"] Aborting");
        var i = 0;
        for(;i < requests.length;i++)
          if(requests[i].id == id)
        {
          requests[i].request.isAborted = true;
          requests[i].request.abort();
          runningRequests++;
          break;
        }
        
        this.removeRequest(id);
      };
      /*
      * Remove request from list
      */
      this.removeRequest = function(id)
      {
        runningRequests--;
        
        console.log("[mediaServer] Removing "+id+" ");

        requests.filter(function(value,index){return value.id != id;});
        
        for(var i in requests)
          if(!requests[i].running)
        {
          requests[i].running = true;
          requests[i].req();
        }
                
      }
      var maxRequests     = 1;
      var runningRequests = 0;
    
      var requests        = new Array();
    
      var url             = require('url');
      var ticket          = 0;
    
      var fs              = require('fs');
      var crypto 		= require('crypto');
    

    };
