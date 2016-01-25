var Config          = require('../config');
var WebSocketServer = require('ws').Server;

function LiveDrawingManager(port)
{
    this.port = port;
    this.server = new WebSocketServer({port:this.port,host:'0.0.0.0'});
    this.server.on('connection',this.onConnection);
}

LiveDrawingManager.prototype.onConnection = function (connection)
{
    connection.on('message',function(message){
        var parsedStroke = JSON.parse(message);
        Server.sendDataToAll({type:"stroke",stroke:{duration:parsedStroke.duration,points:parsedStroke.points, color:parsedStroke.color, lineWidth:parsedStroke.lineWidth}})
    });

    connection.on('close',function (){
    });
}

module.exports = LiveDrawingManager;