var execSync            = require('exec-sync');   
var fs                  = require('fs');
var outputFilename      = '/home/pi/config.json';


var config      = {};

try
{
    config.connectedScreenResolution  = execSync('tvservice -s').replace(/.*?x.*?([0-9]+x[0-9]+).*/g,"$1").split('x');
    config.windowId                   = execSync('cat /home/pi/id'); 

}
catch(err)
{
    config.connectedScreenResolution  = new Array(1024,768);
    config.windowId                   = 1;
    
    console.log("[Config] TV service error. Falling back to 1024x768 with ID 1.");
}


fs.writeFile(outputFilename, JSON.stringify(config, null, 4), function(err) {
    console.log("[Config] Configuration wrote to file "+outputFilename);

    if(typeof(err) == 'null' || !err || err == ''){
            process.exit(0);
    }
});