#!/bin/sh
while true; do 
cd /home/blroot/pmw/server/
node /home/blroot/pmw/server/app.js > /var/log/pmw/node.log	
sleep 1
done