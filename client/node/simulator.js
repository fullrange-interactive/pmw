#!/usr/bin/env node-canvas

/*jslint indent: 2, node: true */
"use strict";

GLOBAL.getRandomInt = function(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
GLOBAL.parseBool = function(value)
{
  if (typeof value === "boolean")
    return value;
  return (typeof value === "undefined") ?
    false :
    // trim using jQuery.trim()'s source 
    value.replace(/^\s+|\s+$/g, "").toLowerCase() === "true";
}

/*
 * Relem unique instance number, shared along every relem.
 */
GLOBAL.instance = 0;
/*
 * mainGrid unique instance, available from everywhere
 */
GLOBAL.mainGrid = false;

var sys = require('sys')

var options = require('./config_simulator.json');
options.windowId = process.argv[2] || options.windowId;
var windowId = options.windowId;

console.log("[Client] windowId " + windowId);

var serverIp = options.server;
var serverPort = options.port;

/*
Starting client
*/
var serverConnection = false;
var client = new(require('websocket').client)();

/*
 * First get the IP address
 */
var os = require('os');
var ifaces = os.networkInterfaces();
var ip = "";
var lastActivity = null;
var newGrid = false;

var pingIntervalSeconds = 20;
var timeoutSeconds = 60;

for (var dev in ifaces)
{
  ifaces[dev].forEach(function(details)
  {
    if (details.family == 'IPv4')
    {
      ip = details.address;
    }
  });
}

/*
 * Now we can connect
 */
client.on('connectFailed', function(error)
{
  serverConnection = false;
});

client.on('connect', function(connection)
{
  console.log('[Client] Connected');
  serverConnection = connection;

  connection.on('error', function(error)
  {
    console.log('[Client] error');
    serverConnection = false;
    console.log(error.msg);
    connection.close();
  });
  connection.on('close', function()
  {
    console.log('[Client] close');
    serverConnection = false;
  });
  connection.on('message', function(message)
  {
    var parsedMessage = false;
    var slide = false;

    lastActivity = (new Date()).getTime();

    try
    {
      parsedMessage = JSON.parse(message.utf8Data);
    }
    catch (e)
    {
      console.error('[Client] Error parsing message ' + message.utf8Data);
      return;
    }

    if (parsedMessage.type == 'slide')
    {
      console.log("[Client] New slide.");
      console.log("====")
      console.log(JSON.stringify(JSON.parse(message.utf8Data), null, 2));
    }
    else if (parsedMessage.type == 'windowModel')
    {
      console.log("[Client] New Grid");
    }
    else if (parsedMessage.type == 'audio')
    {

    }
    else if (parsedMessage.type == 'ping')
    {
      return;
    }
    else
    {
      console.error('[Client] unknown message type: type=' + parsedMessage.type + ' / message:' + message.utf8Data);
      return;
    }
  });
  /*
   * Sending our id
   */
  connection.send(JSON.stringify(
  {
    type: 'announce',
    ip: ip,
    windowId: windowId
  }), function(error)
  {
    if (error)
    {
      console.log('[Client] send Id error');
      connection.close();
      serverConnection = false;
    }
  });
});


client.connect('ws://' + serverIp + ':' + serverPort + '/', 'echo-protocol');

/*
 * Watchdog v 2.0 uses the current TCP connection
 */
var checkInterval = setInterval(function()
{

  if (serverConnection)
  {
    console.log("ping");
    serverConnection.send(JSON.stringify(
    {
      type: 'ping',
      windowId: windowId,
      ip: ip
    }), function() {});
  }
  if (lastActivity + timeoutSeconds * 1000 < (new Date()).getTime())
  {
    console.log("Lost connection to server. Retrying...");
    serverConnection = false;
    client.connect('ws://' + serverIp + ':' + serverPort + '/', 'echo-protocol');
  }
}, pingIntervalSeconds * 1000);
