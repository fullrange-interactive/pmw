#!/bin/bash
serverAddress=$(cat config.txt | sed -n 1p)
windowId=$(cat config.txt | sed -n 2p)
action=$(curl http://$serverAddress/monitoring?check=1windowId=$windowId)
echo $action
if [ $action = "-" ] ; then
	exit 0
elif [ $action = "reboot" ] ; then
	curl http://$serverAddress/monitoring?action=reboot&windowId=$windowId
#	reboot
elif [ $action = "status" ] ; then
	top -l 1 | head -n 10 > laststatus.txt
	curl http://$serverAddress/monitoring?action=status&windowId=$windowId --data-urlencode statusData@/home/pi/laststatus.txt
fi
