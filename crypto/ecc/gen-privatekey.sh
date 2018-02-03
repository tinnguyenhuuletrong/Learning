openssl ecparam -name secp256k1 -genkey -out ec-privatekey.pem
openssl ec -in ec-privatekey.pem -text -param_enc explicit