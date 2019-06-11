const crypto = require('crypto')
const bitcore = require('bitcore-lib')
const secp256k1 = require('secp256k1/elliptic')

const address = '1exkE1DWfbPuWPAEgKwRpQ8aBHjbt7mLx'
const bitCoinPrivateKey = 'L1SfrY4D8V3qcMYFKYsGNt6ZgR75fdsBNeW9ZNgytYyN752ZXW3h'
const pk = bitcore.PrivateKey.fromWIF(bitCoinPrivateKey)

const ecdh = crypto.createECDH('secp256k1')
ecdh.setPrivateKey(pk.toBuffer())
ecdh.getPrivateKey('hex')
const compresedPubKey = ecdh.getPublicKey('buffer', 'compressed')

const pubKeyIns = new bitcore.PublicKey(compresedPubKey)
console.log(bitcore.Address.fromPublicKey(pubKeyIns).toString() === address)
