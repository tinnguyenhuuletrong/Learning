cd lib
go build -buildmode=c-archive -o libgo.a
cd ../
node-gyp build