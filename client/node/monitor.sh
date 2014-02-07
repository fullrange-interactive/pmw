#!/bin/sh
until /usr/local/bin/node --expose-gc --trace-gc /home/pi/pmw/client/node/renderer.js; do
	echo "Node app crashed. Respawning..."
	killall omxplayer.bin
	sleep 5
        killall -9 omxplayer.bin
        sleep 5
done

#/home/pi/pmw/client/node/node_modules/openvg/bin/node-openvg 