#!/bin/bash
openssl genrsa -out privatekey.pem 2048
openssl rsa -text -in privatekey.pem