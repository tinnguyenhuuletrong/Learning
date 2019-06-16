const crypto = require('crypto')
const ecurve = require('ecurve')
const BigInteger = require('bigi')
const bitcore = require('bitcore-lib')

function convertBtcPrivateWipToJwk({
  keyID = '',
  privateKeyWIP,
  isPubKeyOnly = true
}) {
  const pk = bitcore.PrivateKey.fromWIF(privateKeyWIP)
  const pkBuffer = Buffer.from(pk.toString(), 'hex')

  var point = pk.publicKey.point
  var x = point.getX().toBuffer(32)
  var y = point.getY().toBuffer(32)

  return Object.assign(
    {
      kty: 'EC',
      use: 'sig',
      crv: 'secp256k1',
      kid: keyID,
      x: x.toString('base64'),
      y: y.toString('base64'),
      alg: 'ES256'
    },
    isPubKeyOnly ? {} : { d: pkBuffer.toString('base64') }
  )
}

function jwkToBtcPrivateWip(jwkObject) {
  const { d } = jwkObject
  if (!d) throw new Error('JWK dose not contain d')
  const pkBuffer = Buffer.from(d.toString(), 'base64')

  const pkIns = new bitcore.PrivateKey(pkBuffer)
  return pkIns.toWIF()
}

function jwkToBtcAddressCompressed(jwkObject) {
  const { x, y } = jwkObject
  if (!x || !y) throw new Error('JWK dose not contain x or y')
  const data = {
    x: Buffer.from(x, 'base64').toString('hex'),
    y: Buffer.from(y, 'base64').toString('hex')
  }
  const pubIns = new bitcore.PublicKey(data)
  const address = new bitcore.Address(pubIns)
  return address.toString()
}

module.exports = {
  convertBtcPrivateWipToJwk,
  jwkToBtcPrivateWip,
  jwkToBtcAddressCompressed
}
