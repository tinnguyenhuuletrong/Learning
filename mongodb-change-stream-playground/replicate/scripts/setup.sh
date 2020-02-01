#!/bin/bash

MONGODB1=mongodb

sleep 5

echo SETUP.sh time now: `date +"%T" `
mongo --host mongodb:27017 <<EOF
rs.initiate();
EOF