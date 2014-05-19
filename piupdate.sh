#!/bin/bash
/usr/bin/scp $1 root@10.192.54.78:$2
/usr/bin/scp $1 root@10.192.53.222:$2
/usr/bin/scp $1 root@10.192.53.218:$2
/usr/bin/scp $1 root@10.192.53.184:$2
/usr/bin/scp $1 root@10.192.53.78:$2
/usr/bin/scp $1 root@10.192.53.206:$2
/usr/bin/scp $1 root@10.192.54.184:$2
/usr/bin/scp $1 root@10.192.51.188:$2
/usr/bin/scp $1 root@10.192.54.247:$2

ssh root@10.192.54.78 "service pmw stop && service pmw start" &
ssh root@10.192.53.222 "service pmw stop && service pmw start" &
ssh root@10.192.53.218 "service pmw stop && service pmw start" &
ssh root@10.192.53.184 "service pmw stop && service pmw start" &
ssh root@10.192.53.78 "service pmw stop && service pmw start" &
ssh root@10.192.53.206 "service pmw stop && service pmw start" &
ssh root@10.192.54.184 "service pmw stop && service pmw start" &
ssh root@10.192.51.188 "service pmw stop && service pmw start" &
ssh root@10.192.54.247 "service pmw stop && service pmw start" &