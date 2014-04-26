var execSync            = require('exec-sync');   
var fs                  = require('fs');
var outputFilename      = '/home/pi/config.json';
 
var config              = require(outputFilename);

try
{
    config.connectedScreenResolution  = execSync('tvservice -s').replace(/.*?x.*?([0-9]+x[0-9]+).*/g,"$1").split('x');
}
catch(err)
{
    console.log("[Config] TV service error.");
}


fs.writeFile(outputFilename, JSON.stringify(config, null, 4), function(err) {
    console.log("[Config] Configuration wrote to file "+outputFilename);

    if(typeof(err) == 'null' || !err || err == ''){
            process.exit(0);
    }
});