# Let’s keep multiple versions by setting the allow_mult property on the animals bucket
curl -X PUT http://localhost:8098/riak/animals \
  -H "Content-Type: application/json" \
  -d '{"props":{"allow_mult":true}}'


# Bob create first 
curl -i -X PUT http://localhost:8098/riak/animals/bruiser \
  -H "X-Riak-ClientId: bob" \
  -H "Content-Type: application/json" \
  -d '{"score" : 3}'

# Jane pull bob version -> update 1
curl -i -X PUT http://localhost:8098/riak/animals/bruiser \
-H "X-Riak-ClientId: jane" \
-H "X-Riak-Vclock: a85hYGBgzGDKBVI8+xkWvvcLfJTIwOCnlMGUyJjHytA0b8dVviwA" \
-H "Content-Type: application/json" \
-d '{"score" : 2}'

# Rakshith pull bob version -> update 2
curl -i -X PUT http://localhost:8098/riak/animals/bruiser \
  -H "X-Riak-ClientId: rakshith" \
  -H "X-Riak-Vclock: a85hYGBgzGDKBVIs7NtEXmUwJTLmsTI8FMs5zpcFAA==" \
  -H "Content-Type: application/json" \
  -d '{"score" : 4}'

# Should show conflict
curl -i http://localhost:8098/riak/animals/bruiser?return_body=true
  # HTTP/1.1 300 Multiple Choices
  # X-Riak-Vclock: a85hYGBgymDKBVIs7NtEXmUwJTLmsTI8FMs5zgcR5tnPsPC9X+CjRAYGPyWgNDNQ2nr+jqt8WQA=
  # Vary: Accept, Accept-Encoding
  # Server: MochiWeb/1.1 WebMachine/1.10.9 (cafe not found)
  # Last-Modified: Sun, 20 Jan 2019 07:28:59 GMT
  # ETag: "oFUhbnM3Ol0VNUnJ0tepm"
  # Date: Sun, 20 Jan 2019 07:29:01 GMT
  # Content-Type: text/plain
  # Content-Length: 56

  # Siblings:
  # 2ADyyY1VhdVaD7ihfBNUJ7
  # 6rCetTTnT72gLdcyT4A9gr


# Should show conflict
curl -i http://localhost:8098/riak/animals/bruiser?return_body=true \
-H "Accept: multipart/mixed"

# Query by etag
curl -i http://localhost:8098/riak/animals/bruiser?vtag=2ADyyY1VhdVaD7ihfBNUJ7


# Reslove
curl -i -X PUT http://localhost:8098/riak/animals/bruiser?return_body=true \
-H "X-Riak-ClientId: jane" \
-H "X-Riak-Vclock: a85hYGBgymDKBVIs7NtEXmUwJTLmsTI8FMs5zgcR5tnPsPC9X+CjRAYGPyWgNDNQ2nr+jqt8WQA=" \
-H "Content-Type: application/json" \
-d '{"score" : 3}'