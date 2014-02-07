
exports.mediaServer = function()
{
    /*
     * Request media
     */
    this.requestMedia = function(urlString,callbackSuccess,callbackError)
    {        
        var urlObj      = url.parse(urlString);
        var that        = this;
        var thisTicket  = ticket++;
        
        var options = {
          hostname      : urlObj.hostname,
          port          : urlObj.port,
          path          : urlObj.path,
          method        : 'GET',
          encoding      : null
        };

        var req = http.request(options, function(res) {
            
            this.isAborted = false;
            
            var data = [];

            res.on('data', function (chunk){data.push(chunk);});
            res.on('end',function(){
                if(!this.isAborted)
                {
                    console.log("[MediaServer] Request completed ! Got headers:"+res.headers);
                    if(res.statusCode != 200)
                        callbackError('http error',res.statusCode);
                    else
                        callbackSuccess(data);
                    
                    
                    delete(data);
                    data = null;
                    
                    global.gc();
                    
                    that.removeRequest(thisTicket);
                }
            });
        });
        
        req.on('error', function(e) {
            this.isAborted = true;
            this.abort();
            that.removeRequest(thisTicket);
            callbackError('request error',e);
        });
        req.setMaxListeners(0);
        req.end(); 
        
        pendingRequests.push({id:thisTicket,request:req});
    };
    /*
     * Abort pending request
     */
    this.abort  =       function(id){
        console.log("[MediaServer] Aborting "+id);
        var i = 0;
        for(;i < pendingRequests.length;i++)
            if(pendingRequests[i].id == id)
            {
                pendingRequests[i].request.isAborted = true;
                pendingRequests[i].request.abort();
                break;
            }
        
        this.removeRequest(id);
    };
    /*
     * Remove request from list
     */
    this.removeRequest = function(id)
    {
        console.log("[MediaServer] Removing "+id);

        pendingRequests.filter(function(value,index){return value.id != id;});
    }
    
    var pendingRequests = new Array();
    var http            = require('http');
    var url             = require('url');
    var ticket          = 0;

};