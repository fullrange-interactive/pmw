#!/bin/sh
until /usr/local/bin/node /home/pi/pmw/client/node/renderer.js; do
	echo "Node app crashed. Respawning..."
	killall omxplayer.bin
	sleep 5
        killall -9 omxplayer.bin
        sleep 5
done
