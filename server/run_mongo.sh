#!/bin/sh
until mongod --dbpath=data > /var/log/pmw_db; do
    echo "Server crashed with exit code $?.  Respawning.." >&2
    sleep 1
done
