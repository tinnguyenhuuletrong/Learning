#!/usr/bin/bash

../bin/bin/protoc --proto_path=../ --go_out=./messasing simple.proto
