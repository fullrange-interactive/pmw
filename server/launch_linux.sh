#!/bin/sh

MONGOD_BIN=mongod
MONGOD_DB="data/db/"
number=$(/bin/ps aux | grep $MONGOD_BIN | /usr/bin/wc -l)
if [ $number -gt 1 ] 
    then
    echo "Mongodb already started"
else
    $MONGOD_BIN --dbpath=$MONGOD_DB > /dev/null &
    echo "Started mongodb"
    /bin/sleep 4
fi

NODE_BIN=node
APP_NAME=app.js
number=$(/bin/ps aux | grep $NODE_BIN | grep -i "$APP_NAME" | /usr/bin/wc -l)
if [ $number -gt 1 ] 
    then
    echo "Node already started"
else
    $NODE_BIN $APP_NAME > /dev/null &
    echo "Started node"
    /bin/sleep 4
fi

