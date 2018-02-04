openssl req -new -key ec-privatekey.pem -x509 -nodes -days 365 -out ecda_cer.pem
openssl x509 -in ecda_cer.pem -text