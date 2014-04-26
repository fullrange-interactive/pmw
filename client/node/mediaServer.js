exports.mediaServer = function()
{ 
    this.createRequest = function(urlString,callbackSuccess,callbackError,thisTicket)
    {
        var req = require('child_process').spawn('/usr/bin/nice', ['-n','19','/usr/bin/ionice','-c2','-n7','wget',urlString,'-q','-Omedia_'+thisTicket],{ cwd:'/tmp/'});

        req.isAborted = false;
        
        req.stdout.on('data', function (data) {
//           console.log('[MediaServer][stdout] Out: ' + data);
        });

        req.stderr.on('data', function (data) {
//           req.isAborted = true;
//           console.log('[MediaServer][stderr] Error: ' + data);
        });

        var that = this;
        
        req.on('close', function (code) {
              console.log("[mediaServer.createRequest][request "+thisTicket+"] Finished with code " + code);

            if(req.isAborted || code < 0)
            {   
                callbackError('req error',0);
                return;
            }
            var fs = require('fs');
            fs.readFile('/tmp/media_'+thisTicket,{},function(err,data)
            {
                if(err)
                {
                    console.log("[mediaServer.createRequest][readfile] error reading file /tmp/media_"+thisTicket+". Error:"+err);

                    callbackError('read error',0);
                }
                else
                   callbackSuccess(data);

            });
            that.removeRequest(thisTicket);
        });   
    }
    /*
     * Request media
     */
    this.requestMedia = function(urlString,callbackSuccess,callbackError)
    {       
        var thisTicket  = ticket++;
        var that = this;

        if(runningRequests == maxRequests)
        {
            requests.push({
                id      :thisTicket,
                req     :function(){that.createRequest(urlString,callbackSuccess,callbackError,thisTicket);},
                running :false});
            
            console.log("[mediaServer.requestMedia] Getting "+urlString+" queued");
            return thisTicket;
        }
        
        console.log("[mediaServer.requestMedia] Getting "+urlString+" immediately");
        
        runningRequests++;
    
        requests.push({
            id          :thisTicket,
            request     :that.createRequest(urlString,callbackSuccess,callbackError,thisTicket),
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

};