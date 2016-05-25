
width=800
height=600
ip="192.168.1.109"

for f in *.mp4; 
do 
	echo "Processing $f file.."; 
	ffmpeg -i $f -an  -c:v libx264 -preset fast -vprofile baseline -tune fastdecode -g 1 -filter:v "scale=iw*min($width/iw\,$height/ih):ih*min($width/iw\,$height/ih), pad=$width:$height:($width-iw*min($width/iw\,$height/ih))/2:($height-ih*min($width/iw\,$height/ih))/2"  resized/$f

done

zip -r resized.zip resized
scp resized.zip root@$ip:/root/
ssh root@$ip "unzip /root/resized.zip"