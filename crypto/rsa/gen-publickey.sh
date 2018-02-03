openssl rsa -pubout -in privatekey.pem -out publickey.pem
openssl pkey -in publickey.pem -pubin -text