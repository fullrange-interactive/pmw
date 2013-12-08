exports.class = {
    type:'Video',
    execHandle:{},
    draw:function(ctx){},
    isReady:false,
    load:function(callback){
        
//         this.omx = require('omxcontrol');
//         this.omx.start(this.data.url,this.left,this.top,this.left+this.width,this.top+this.height);
        console.log("[Video] Play");
        
        this.exec = require('child_process').exec;
        
        
        this.execHandle = this.exec(
            'omxplayer -o hdmi --loop --win "'+Math.round(this.left)+' '+Math.round(this.top)+' '+Math.round(this.left+this.width)+' '+Math.round(this.top+this.height)+'" "'+this.data.url+'"',
           
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
                console.log(this.execHandle.pid+2);

        this.isReady = true;
        callback();
    },
    cleanup:function(){
         this.exec('killall omxplayer.bin')

        console.log("[Video] Quit");
//         this.omx.quit();
   }
};