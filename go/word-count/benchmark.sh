echo "------------\n\tV1\n------------"
/usr/bin/time -lp go run ./v1/main.go ./sample.txt

echo "------------\n\tV2\n------------"
/usr/bin/time -lp go run ./v2/main.go ./sample.txt