const fs = require("fs");
const crypto = require("crypto");

const msg = "hello";
const pubKey = fs.readFileSync("./publickey.pem");
const privKey = fs.readFileSync("./privatekey.pem");

const res = crypto.publicEncrypt(
  {
    key: pubKey,
  },
  Buffer.from(msg)
);

console.log(res.toString("hex"));
