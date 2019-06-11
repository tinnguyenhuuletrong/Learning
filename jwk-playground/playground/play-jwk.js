const bitcore = require('bitcore-lib')
const crypto = require('crypto')
const njwk = require('node-jwk')

const time = Math.floor(Date.now() / 1000)
const claims = {
  iss: 'itsME',
  aud: 'myAudience',
  iat: time,
  exp: time + 3600
}

const myKeySetJson = {
  keys: [
    {
      kty: 'EC',
      d: 'fgRA5jQErhLOscrE5p+UZQkYZx2nc3k1K9OECEBLPFM=',
      use: 'sig',
      crv: 'secp256k1',
      kid: 'key-pair-1',
      x: '+/GiLm97iZqVshpU2HQtSdHWZElE6OKLxnKlzZ7xn5k=',
      y: '8Bf50Zmh9p245Rpz53VGPQKXETAfHYObr49T5+M21+A=',
      alg: 'ES256'
    }
  ]
}

const myKeySet = njwk.JWKSet.fromObject(myKeySetJson)
const jwk = myKeySet.findKeyById('key-pair-1')
console.log('hasPrivateKey:', jwk.key.hasPrivateKey)
const keyPEM = jwk.key.toPrivateKeyPEM()
console.log(jwk.key._d)

const ecdh = crypto.createECDH('secp256k1')
ecdh.setPrivateKey(jwk.key._d)
const uncompressedPubKey = ecdh.getPublicKey('buffer', 'uncompressed')
console.log('uncompressedPubKey', uncompressedPubKey.toString('hex'))

const compresedPubKey = ecdh.getPublicKey('buffer', 'compressed')
console.log('compresedPubKey', compresedPubKey.toString('hex'))

const pubKeyIns = new bitcore.PublicKey(compresedPubKey)
console.log('btcAddress', bitcore.Address.fromPublicKey(pubKeyIns).toString())
