#!/bin/bash
openssl genpkey -algorithm RSA -out privatekey.pem -pkeyopt rsa_keygen_bits:1024
openssl rsa -text -in privatekey.pem