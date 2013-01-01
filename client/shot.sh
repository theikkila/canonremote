FNAME=`date +%Y%m%d%H%M%S`
# Take the photo using gphoto2
env LANG=C gphoto2 --quiet --debug --debug-logfile=gphoto.log --filename=$FNAME.jpg --capture-image-and-download
# Convert image captured from camero to smaller thumbnail
convert $FNAME.jpg -resize 20% $FNAME.jpg
# Mark new filename to latest-file so the script could send it to server
echo -n $FNAME > latest
