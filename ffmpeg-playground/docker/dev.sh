WORKING_DIR=`pwd`
docker run -v $WORKING_DIR:/usr/work -it test /bin/bash