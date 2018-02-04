openssl req -new -key privatekey.pem -x509 -nodes -days 365 -out rsa_cer.pem
openssl x509 -in rsa_cer.pem -text