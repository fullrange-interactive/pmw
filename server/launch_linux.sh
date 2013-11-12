#!/bin/sh

PATH="Server/"
MONGOD_EXEC=mongod
MONGOD_DB="data/db/"
MONGOD_PATH="mongodb-linux/"
number=$(/bin/ps aux | /usr/bin/grep $MONGOD_EXEC | /usr/bin/wc -l)
if [ $number -gt 1 ] 
    then
    echo "Mongodb already started"
else
    $($PATH$MONGOD_PATH$MONGOD_EXEC --dbpath=$PATH$MONGOD_PATH$MONGOD_DB > /dev/null &)
    echo "Started mongodb"
    /bin/sleep 4
fi

NODE_EXEC=node
NODE_PATH=/usr/local/bin/
APP_NAME=app.js
number=$(/bin/ps aux | /usr/bin/grep $NODE_EXEC | /usr/bin/wc -l)
if [ $number -gt 1 ] 
    then
    echo "Node already started"
else
    $($NODE_PATH$NODE_EXEC $PATH$APP_NAME > /dev/null &)
    echo "Started node"
    /bin/sleep 4
fi

BROWSER_PATH="Pimp-My-Wall.app"
$(/usr/bin/open $BROWSER_PATH &)
