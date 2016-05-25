var config = {
  ip:'192.168.1.109',
  port:'1337',
  files:['1.mp4','2.mp4','3.mp4','4.mp4','5.mp4','6.mp4','7.mp4','8.mp4','giphy.mp4','giphy_1.mp4','giphy_2.mp4','giphy_3.mp4','giphy_4.mp4','giphy_5.mp4','giphy_6.mp4']

}
var connected = false;
var connecting = false;
var fileIndex = 0;
var i = null;


var net = require('net');

var client = new net.Socket();

client.on("error", function(error)
{
  console.log("Error connecting to vidplayer");
  console.log(error);

  connected = false; 
  connecting = false; 
});

sendPlay = function(client,fileToPlay)
{
  client.write(JSON.stringify(
  {
    command: "play",
    fileName: fileToPlay
  })+"\n");
}

sendPause = function(client)
{
  client.write(JSON.stringify(
  {
    command: "pause"
  })+"\n");
}

doSomething = function()
{
  if(connected && Math.random() < 0.02)
  {
    var fileToPlay = config.files[Math.floor((Math.random() * (config.files.length-1)))];
    console.log('play '+fileToPlay);
    sendPlay(client,fileToPlay);

    if(Math.random() > 0.8)
    {
      console.log('pause');
      sendPause(client);     

    }
  }
  else if(connected == false)
  {
    client.connect(config.port, config.ip, function()
    {
      console.log('Connected to vidplayer');
      connected = true;
    });
  }
}

var stdin = process.stdin;

// without this, we would only get streams once enter is pressed
stdin.setRawMode( true );

// resume stdin in the parent process (node app won't quit all by itself
// unless an error or process.exit() happens)
stdin.resume();

// i don't want binary, do you?
stdin.setEncoding( 'utf8' );

// on any data into stdin
stdin.on( 'data', function( key ){

  if(connected == false && connecting == false)
  {
    connecting = true;

    client.connect(config.port, config.ip, function()
    {
      console.log('Connected to vidplayer');

      connected = true;
      connecting = false;
    });
  }

  // ctrl-c ( end of text )
  switch(key)
  {
    case '\u0003':
      process.exit();
    break;
    case 'n':
      fileIndex = (fileIndex+1)%config.files.length;
      sendPlay(client,config.files[fileIndex]);
    break
    case 'p':
      sendPause(client);
    break;
    case 'i':
      if(i===null)
        i = setInterval(doSomething,100);
      else
      {
        clearInterval(i);
        i=null;
      }
    break;
  }
  // write the key to stdout all normal like
  process.stdout.write( key );
});

