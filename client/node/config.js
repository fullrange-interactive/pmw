var exec = require('child_process').exec;
var fs                  = require('fs');
var outputFilename      = '/root/config.json';
 
var config              = require(outputFilename);

try
{
    exec('tvservice -s',function(error, stdout,stderr)
	{
		console.log(error);
		config.connectedScreenResolution = stdout.replace(/.*?x.*?([0-9]+x[0-9]+).*/g,"$1").trim().split('x');
		fs.writeFile(outputFilename, JSON.stringify(config, null, 4), function(err) {
    			console.log("[Config] Configuration wrote to file "+outputFilename);
    			if(typeof(err) == 'null' || !err || err == ''){
            			process.exit(0);
    			}
		});
	});
}
catch(err)
{
    console.log("[Config] TV service error.");
}
