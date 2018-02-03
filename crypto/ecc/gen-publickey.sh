openssl ec -in ec-privatekey.pem -pubout -out ec-publickey.pem
openssl ec -in ec-publickey.pem -pubin -text