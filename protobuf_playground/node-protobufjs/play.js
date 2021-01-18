const protobuf = require("protobufjs");

async function main() {
  const root = await protobuf.load("./sample.proto");

  const AwesomeMessage = root.lookupType("AwesomeMessage");

  const payload = {
    strField: "hello",
    floatField: 1.5,
    intField: 10,
    bufferField: Buffer.from("abcd"),
  };

  const err = AwesomeMessage.verify(payload);
  if (err) throw new Error(err);

  const msg = AwesomeMessage.create(payload);
  const buffer = AwesomeMessage.encode(msg).finish();

  console.log("encoded:", buffer);

  const decodedMsg = AwesomeMessage.decode(buffer);
  const decodedObj = AwesomeMessage.toObject(decodedMsg);
  console.log("decoded:", decodedObj);
}

main();
