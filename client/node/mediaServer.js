
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
        
        console.log("[MediaServer] Getting "+urlString);
    
        var req = spawn('/usr/bin/nice', ['-n','19','/usr/bin/ionice','-c2','-n7','wget',urlString,'-q','-Omedia_'+thisTicket],{ cwd:'/tmp/'});
        
	//console.log("");

        req.isAborted = false;
        
        req.stdout.on('data', function (data) {
          console.log('[MediaServer][stdout] Out: ' + data);
        });

        req.stderr.on('data', function (data) {
//           req.isAborted = true;
          console.log('[MediaServer][stderr] Error: ' + data);
        });

        req.on('close', function (code) {
              console.log('[MediaServer]Finished with code ' + code);

            if(req.isAborted || code < 0)
            {   
		console.log('[MediaServer] wget return error '+code);
                callbackError('req error',0);
                return;
            }
            var fs = require('fs');
            fs.readFile('/tmp/media_'+thisTicket,{},function(err,data)
            {
                if(err)
                {
                    console.log('[MediaServer][readfile] error reading file /tmp/media_'+thisTicket+'. Error:'+err);

                    that.removeRequest(thisTicket);
                    callbackError('read error',0);
                }
                else
		{
                    console.log('[MediaServer][readfile] Success reading /tmp/media_'+thisTicket);

                   callbackSuccess(data);
		}

            });
        });
        
//         http.request(options, function(res) {
//             
//             this.isAborted = false;
//             
//             var data = [];
// 
//             res.on('data', function (chunk){data.push(chunk);});
//             res.on('end',function(){
//                 if(!this.isAborted)
//                 {
//                     console.log("[MediaServer] Request completed ! Got headers:"+res.headers);
//                     if(res.statusCode != 200)
//                         callbackError('http error',res.statusCode);
//                     else
//                         callbackSuccess(data);
//                     
//                     
//                     delete(data);
//                     data = null;
//                     
//                     global.gc();
//                     
//                     that.removeRequest(thisTicket);
//                 }
//             });
//         });
//         
//         req.on('error', function(e) {
//             this.isAborted = true;
//             this.abort();
//             that.removeRequest(thisTicket);
//             callbackError('request error',e);
//         });
//         req.setMaxListeners(0);
//         req.end(); 
//         
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
    
    var spawn           = require('child_process').spawn;
    var fs              = require('fs');

};
