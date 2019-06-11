const crypto = require('crypto')
const ecurve = require('ecurve')
const BigInteger = require('bigi')
const bitcore = require('bitcore-lib')

function convertBtcPrivateWipToJws({
  keyID = '',
  privateKeyWIP,
  isPubKeyOnly = true
}) {
  const pk = bitcore.PrivateKey.fromWIF(privateKeyWIP)
  const pkBuffer = Buffer.from(pk.toString(), 'hex')

  var ecparams = ecurve.getCurveByName('secp256k1')
  var curvePt = ecparams.G.multiply(BigInteger.fromBuffer(pkBuffer))
  var x = curvePt.affineX.toBuffer(32)
  var y = curvePt.affineY.toBuffer(32)

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

module.exports = { convertBtcPrivateWipToJws }
