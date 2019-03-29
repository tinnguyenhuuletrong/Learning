const fs = require('fs')
const path = require('path')
const lib = require('../lib/steganography')

async function simpleEncrypt() {
  const inputFile = path.join(__dirname, './resources/lenna.png')
  const outputFile = path.join(__dirname, './output/lenna_out.png')
  const data = require('./resources/json-data.json')
  const outputBuffer = await lib.encodeImageFromFile(
    inputFile,
    Buffer.from(JSON.stringify(data)),
    { debug: true }
  )
  fs.writeFileSync(outputFile, outputBuffer)
}

async function simpleEncryptJPG() {
  const inputFile = path.join(__dirname, './resources/sample.jpg')
  const outputFile = path.join(__dirname, './output/sample_out.jpg')
  const data = require('./resources/json-data.json')
  const outputBuffer = await lib.encodeImageFromFile(
    inputFile,
    Buffer.from(JSON.stringify(data)),
    { debug: true }
  )
  fs.writeFileSync(outputFile, outputBuffer)
}

async function simpleDecrypt(outputFile) {
  const data = await lib.decodeImageFromFile(outputFile)
  console.log(outputFile, '---> ', data.toString())
}

async function main() {
  await simpleEncrypt()
  await simpleDecrypt('./output/lenna_out.png')
  // await simpleEncryptJPG()
  // await simpleDecrypt('./output/sample_out.jpg')
  // await wrongFileDecrypt()
}
main()
