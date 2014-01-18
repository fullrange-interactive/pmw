exports.class = {
    type:'Video',
    cleared:false,
    needRedraw:true,
    execHandle:{},
    firstDraw:true,
    draw:function(ctx){
        if(!this.cleared)
        {
            ctx.clearRect(this.left,this.top,this.width,this.height);
            this.cleared = true;
            if ( this.firstDraw ){
                this.execHandle = this.exec(
                    'omxplayer -o hdmi --loop --win "'+Math.round(this.left)+' '+Math.round(this.top)+' '+Math.round(this.left+this.width)+' '+Math.round(this.top+this.height)+'" "'+this.data.url+'" >> /tmp/omxlog',

                    { encoding: 'utf8',
                      timeout: 0,
                      maxBuffer: 200*1024,
                      killSignal: 'SIGTERM',
                      cwd: '/home/pi/pmw/client/node/',
                      env: null
                    },
                    function(error, stdout, stderr) {
                    console.log("[Omxcontrol] omxplayer exited");
                    console.log(stderr);
                    console.log(stdout);
                });
                this.needRedraw = false;
                this.firstDraw = false;
            }
        }

    },
    isReady:false,
    load:function(callback){
        
//         this.omx = require('omxcontrol');
//         this.omx.start(this.data.url,this.left,this.top,this.left+this.width,this.top+this.height);
        console.log("[Video] Play");
        
        this.exec = require('child_process').exec;

        this.isReady = true;
        callback();
    },
    cleanup:function(){
        //Find out which instance of omxplayer to quit
        var that = this;
        this.exec('ps -e -o etime,pid,comm | grep omxplayer.bin', function (error, stdout, stderr) {
            if ( stdout != null && stdout != "" ){
                var lines = stdout.split("\n");
                if ( lines.length == 1 ){
                    that.exec("killall omxplayer.bin");
                    return;
                }
                var longestTime = 0;
                var pid = 0;
                for( i in lines ){
                    var line = lines[i];
                    var parts = line.match(/([0-9\:\-]+)/);
                    if ( parts != null ){
                        var total = 0;
                        var rest = [];
                        if ( parts[0].indexOf("-") != -1 ){
                            total += parseInt(parts[0].split("-")[0])*3600*24;
                            rest = parts[0].split("-")[1].split(":");
                        }else{
                            rest = parts[0].split(":");
                        }
                        if ( rest.length == 3 ){
                            total += parseInt(rest[0])*3600 + parseInt(rest[1])*60 + parseInt(rest[2]);
                        }else{
                            total += parseInt(rest[0])*60 + parseInt(rest[1]);
                        }
                        if ( total > longestTime ){
                            longestTime = total;
                            pid = parseInt(line.match(/(( \d+ )+)/));
                        }
                    }
                }
                that.exec("kill " + pid);
            }
        });

        console.log("[Video] Quit");
//         this.omx.quit();
   }
};