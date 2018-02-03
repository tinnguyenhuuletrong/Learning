openssl enc -aes-256-cbc -in message.txt -out message.bin
openssl enc -base64 -in message.bin -out message.b64