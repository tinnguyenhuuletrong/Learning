const protobuf = require("protobufjs");
const fs = require("fs");

async function main() {
  const root = await protobuf.load("./sample.proto");

  const AwesomeMessage = root.lookupType("AwesomeMessage");
  const img = fs.readFileSync("./mrz_passport_3.jpeg");

  const payload = {
    strField: "hello",
    floatField: 1.5,
    intField: 10,
    bufferField: img,
  };

  const err = AwesomeMessage.verify(payload);
  if (err) throw new Error(err);

  const msg = AwesomeMessage.create(payload);
  const buffer = AwesomeMessage.encode(msg).finish();

  console.log("original size:", img.length);
  console.log("encoded size:", buffer.length);
  console.log("encoded:", buffer);

  const decodedMsg = AwesomeMessage.decode(buffer);
  const decodedObj = AwesomeMessage.toObject(decodedMsg);
  console.log("decoded:", decodedObj);
}

main();
