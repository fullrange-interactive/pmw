// var dbus = require('dbus-native');
var fs = require('fs');

exports.class = { 
    type:'Video',
    cleared:false,
    needRedraw:true,
    execHandle:{},
    firstDraw:true,
    sameCanvas:false,
    killing:false,
    dbusConn:null,
    drawZone:function(ctx,x,y,width,height)
    {
        ctx.clearRect(x,y,width,height);
    },
    draw:function(ctx){
        
        ctx.clearRect(this.left,this.top,this.width,this.height);

        if(!this.cleared)
        {
            this.cleared = true;
            if ( this.firstDraw ){
                this.needRedraw = false;
                this.firstDraw = false;
            }
        }

    },
    isReady:false,
    load:function(callback){
        
        console.log("[Video] Play");
        
        this.exec = require('child_process').exec;

        this.execHandle = this.exec('/usr/bin/nice -n 5 /usr/bin/ionice -c2 -n7 omxplayer --no-keys -o hdmi --loop --win "'+Math.round(this.left)+' '+Math.round(this.top)+' '+Math.round(this.left+this.width)+' '+Math.round(this.top+this.height)+'" "'+this.data.url+'" >> /tmp/omxlog',
        { 
          encoding      : 'utf8',
          timeout       : 0,
          maxBuffer     : 200*1024,
          killSignal    : 'SIGTERM',
          cwd           : '/home/pi/pmw/client/node/',
          env           : null
        },
        function(error, stdout, stderr) {
            console.log("[Omxcontrol] omxplayer exited");
//             console.log(stderr);
//             console.log(stdout);
        });
        var that = this;
        
        setTimeout(function(){
            that.isReady = true;
            //Try to connect with dbus
//             var dbusaddress = fs.readFileSync('/tmp/omxplayerdbus').toString();
//             console.log("[Video] "+dbusaddress);
//             
//             this.dbusConn = dbus({busAddress:dbusaddress});
//             this.dbusConn.message({
//                 path:'/org/mpris/MediaPlayer2',
//                 destination:'org.mpris.MediaPlayer2.omxplayer',
//                 'interface':'org.mpris.MediaPlayer2.Player',
//                 member:'Action',
//                 type: dbus.messageType.methodCall,
//                 signature:'i',
//                 body:[16]
//             });
//             console.log("[Video] Message send");
// 
//             this.dbusConn.on('message', function(msg) {"[Video][dbus.message] "+console.log(msg); });
//             this.dbusConn.on('error', function(msg) {"[Video][dbus.error] "+console.log(msg); });

            callback();
        },5000);
    },
    cleanup:function()
    {
        if(this.killing)
            return;
        
        this.killing = true;
        console.log("[Video] Killing omxplayer");
        //Find out which instance of omxplayer to quit
        var that = this;
        this.exec('ps -e -o etime,pid,comm | grep omxplayer.bin', function (error, stdout, stderr) {
            if ( stdout != null && stdout != "" ){
                var lines = stdout.split("\n");
//                 if ( lines.length == 1 ){
//                     that.exec("killall omxplayer.bin");
//                     return;
//                 }
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