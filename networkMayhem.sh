#!/bin/bash

serverIp=192.168.3.2

inputMuted=0
outputMuted=0

while true; do
    sleep=$[ ( $RANDOM % 200 ) + 1 ]
    cond=$[ ( $RANDOM % 2 ) ]
    
    echo "Sleeping $sleep"

    sleep $[ ( $RANDOM % 200 ) + 1 ]

    if [ "$cond" -eq 0 ]
    then
        if [ "$inputMuted" -eq 0 ]
        then
            echo "Disabling input packets"
            sudo iptables -I INPUT -s $serverIp -j DROP
            inputMuted=1
        else
            echo "Restoring input packets"        
            sudo iptables -D INPUT 1
            inputMuted=0
        fi
    else
        if [ "$outputMuted" -eq 0 ]
        then
            echo "Disabling output packets"        
            sudo iptables -I OUTPUT -d $serverIp -j DROP
            outputMuted=1
        else
            echo "Restoring output packets"                
            sudo iptables -D OUTPUT 1
            outputMuted=0
        fi
    fi
done