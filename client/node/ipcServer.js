exports.ipcServer = function()
{
  var getRelemIdEntryById = function(id)
  {
    for (var i in callbackList)
      if (callbackList[i].id == id)
        return i;

    return -1;
  }

  var getRelemEntryByRelemProperties = function( /*x,y,*/ zIndex, type)
  {
    for (var i in callbackList)
      if ( /*neighborList[i].x == x && neighborList[i].y == y && */ callbackList[i].z == zIndex)
        return callbackList[i];

    return false;
  }

  var getNeighborByXY = function(x, y)
  {
    for (var i in neighborList)
      if (neighborList[i].x == x && neighborList[i].y == y)
        return neighborList[i];

    return false;
  }

  var deleteNeighbor = function(x, y)
  {
    for (var i in neighborList)
      if (neighborList[i].x == x && neighborList[i].y == y)
      {
        delete(neighborList.splice(i, 1));
        return true;
      }

    return false;
  }
  this.registerCallback = function(destRelemzIndex, destRelemType, callback)
  {
    console.log("[ipcServer][registerCallback] Registering callback for " + destRelemzIndex + " of type " + destRelemType);

    callbackList.push(
    {
      id: callbackId,
      z: destRelemzIndex,
      type: destRelemType,
      callback: callback

    });

    return callbackId++;
  }

  this.clearCallbackQueue = function()
  {
    console.log("[ipcServer] Deregistering all callbacks");

    callbackList = new Array();
  }

  this.deregisterCallback = function(callbackId)
  {
    var localCallbackId = getRelemIdEntryById(callbackId);

    if (callbackId < 0)
    {
      console.log("[ipcServer][Error] Trying to deregister callback with unknown ID = " + callbackId);
      return;
    }
    delete(callbackList.splice(localCallbackId, 1));

    console.log("[ipcServer] Deregistering callback with id " + callbackId);
  }

  this.notifyNeighbor = function(x, y, zindex, type, message)
  {
    var ip = getNeighborByXY(x, y).ip;

    var msg = JSON.stringify(
    {
      z: zindex,
      type: type,
      msg: message
    });

    //         console.log("[ipcServer.notifyNeighbor] Sending message '"+msg+"' to ip: "+ip);

    msg = new Buffer(msg);

    try
    {
      server.send(msg, 0, msg.length, 4242, ip);
    }
    catch (e)
    {
      console.log("[ipcServer.notifyNeighbor][Error] Sending message to ip: " + ip + " failed");
      return false;
    }
    return true;
  }

  this.updateNeighbors = function(neighbors)
  {
    var newNeighborsList = new Array();

    for (var i in neighbors)
    {
      var neighbor = getNeighborByXY(neighbors[i].x, neighbors[i].y);

      if (neighbor)
        deleteNeighbor(neighbor.x, neighbor.y);

      //             console.log("[ipcServer] Added neighbour: ["+neighbors[i].x+";"+neighbors[i].y+"] ip:"+neighbors[i].ip);
      newNeighborsList.push(
      {
        x: neighbors[i].x,
        y: neighbors[i].y,
        ip: neighbors[i].ip
      });
    }
    neighborList = newNeighborsList;
  }

  this.rebind = function()
  {
    if (connected)
    {
      console.log("[ipcServer] Rebind ommited, server seems connected");
      return true;
    }
    try
    {
      server.bind(4242);
      connected = true;
    }
    catch (e)
    {
      console.log("[ipcServer][Error] Rebind failed");
      return false;
    }
    console.log("[ipcServer] Rebind");

    return true;

  }

  var callbackId = 0;

  var neighborList = new Array();
  var callbackList = new Array();

  var dgram = require('dgram');
  var server = dgram.createSocket("udp4");
  var connected = false;

  server.on("error", function(err)
  {
    console.log("[ipcServer] Server error:\n" + err.stack);
    server.close();
    connected = false;
  });

  server.on("message", function(msg, rinfo)
  {
    console.log("[ipcServer] Server message " + rinfo.address + ":" + rinfo.port);

    if (rinfo.address.localeCompare("127.0.0.1") == 0)
    {
      return;
    }

    //       console.log("[ipcServer] Message "+msg);
    msg = JSON.parse(msg);

    // When we receive a message, call callback of the registered relem

    var relem = getRelemEntryByRelemProperties( /*msg.x,msg.y,*/ msg.z, msg.type);

    if (!relem)
    {
      console.log("[ipcServer][Error] Message has no dest. Params: " + msg.z + "," + msg.type);
      return;
    }

    //       console.log(JSON.stringify(relem));

    relem.callback(msg);
  });

  server.on("listening", function()
  {
    var address = server.address();
    console.log("[ipcServer] Listening on " + address.address + ":" + address.port);
  });

  server.bind(4242);
  connected = true;
};
