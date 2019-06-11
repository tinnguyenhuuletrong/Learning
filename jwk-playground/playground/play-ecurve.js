var ecurve = require('ecurve')
const BigInteger = require('bigi')
var crypto = require('crypto')

// Gen key
// const ecdh = crypto.createECDH('secp256k1')
// ecdh.generateKeys()
// const pk = ecdh.getPrivateKey('hex')
// const pubKey = ecdh.getPublicKey('hex')
// console.log(pk, pubKey)

const privateKeyHex =
  '80dd91f731d50bf5d369b4c46f902ca28dec37e787eae799d564696318140c6f'
const publicKeyHex =
  '044b5ad1116dbdc78142906736d362a975a0b369bd3fcda69b4b834b738e53cb49346dbdf85269e450b4d3ccfa8351e06c5223a5d372f58d26b4b3e15219bd893f'

function keyToPoints(privateKeyHex) {
  var ecparams = ecurve.getCurveByName('secp256k1')
  var curvePt = ecparams.G.multiply(
    BigInteger.fromBuffer(Buffer.from(privateKeyHex, 'hex'))
  )
  var x = curvePt.affineX.toBuffer(32)
  var y = curvePt.affineY.toBuffer(32)

  var publicKey = Buffer.concat([Buffer.from([0x04]), x, y])
  console.log(Buffer.from(privateKeyHex, 'hex'), x, y)
  return {
    d: Buffer.from(privateKeyHex, 'hex').toString('base64'),
    x: x.toString('base64'),
    y: y.toString('base64')
  }
}

console.log(keyToPoints(privateKeyHex))
