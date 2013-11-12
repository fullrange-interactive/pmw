var RELEMS = Array("Mire","staticImage","Marquee")

var clients = Array();

process.stdin.resume();
process.stdin.setEncoding('utf8');
var util = require('util');

var WebSocketServer = require('ws').Server
var clientsServer = new WebSocketServer({port:80});
clientsServer.on('connection', function(client) {
    clients.push(client);
    /*
    setInterval(function(){
        ws.send(JSON.stringify({type:"command",relem:RELEMS[Math.floor(Math.random()*RELEMS.length)],x:Math.floor(Math.random()*5)*2,y:Math.floor(Math.random()*5)*2,width:1,height:1,data:{color:Math.ceil(Math.random()*16777215).toString(16)}}));
    }, 300);*/
    console.log("opened conenction");
});

clientsServer.on('error', function(ws) {
    //clients.splice(clients.indexOf(ws),1);
    /*
    setInterval(function(){
        ws.send(JSON.stringify({type:"command",relem:RELEMS[Math.floor(Math.random()*RELEMS.length)],x:Math.floor(Math.random()*5)*2,y:Math.floor(Math.random()*5)*2,width:1,height:1,data:{color:Math.ceil(Math.random()*16777215).toString(16)}}));
    }, 300);*/
    console.log("closed conenction");
});

process.stdin.on('data', function (text) {
    eval("var toSend="+text);
    try{
        clients[clients.length-1].send(JSON.stringify({type:"command",relem:toSend.relem,x:toSend.x,y:toSend.y,width:1,height:1,data:toSend.data}));
    }catch(e)
    {
        
    }
});