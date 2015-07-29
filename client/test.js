var serverConnection = false;
var client              = new (require('websocket').client)();

client.on("error", function(error){
    console.log("Error connecting : " + error);
});
client.on('connectFailed', function(error) {
    serverConnection    = false;
});

client.on('connect', function(connection)
{
    console.log('[Client] Connected');
});

client.connect('ws://bill.pimp-my-wall.ch:8000/', 'echo-protocol');