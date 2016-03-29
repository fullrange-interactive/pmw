#!/bin/sh
while true; do 
cd /home/ubuntu/pmw/server/
node /home/ubuntu/pmw/server/app.js > /var/log/pmw/node.log	
sleep 1
done
