const njwk = require('node-jwk')
const njwt = require('njwt')

const jwkObject = {
  kty: 'EC',
  use: 'sig',
  crv: 'secp256k1',
  kid: '1',
  x: '+/GiLm97iZqVshpU2HQtSdHWZElE6OKLxnKlzZ7xn5k=',
  y: '8Bf50Zmh9p245Rpz53VGPQKXETAfHYObr49T5+M21+A=',
  alg: 'ES256',
  d: 'fgRA5jQErhLOscrE5p+UZQkYZx2nc3k1K9OECEBLPFM='
}

const jwkObject2 = {
  kty: 'EC',
  use: 'sig',
  crv: 'secp256k1',
  kid: '2',
  x: 'tjqtGNcOsQMspFU1RXDpOkYL+KX/b8p+/eInpmqBMZU=',
  y: 's0HLe7/THb1c6vMH1AFzxRGkGxXkIhryy2w1dNWQD7w=',
  alg: 'ES256',
  d: 'VhdQJNUmU8gOWZz812ZdcIiNiZasVi2RToSACv6oELA='
}

const ins = njwk.JWK.fromObject(jwkObject)
const ins2 = njwk.JWK.fromObject(jwkObject2)

const pemPriKey = ins.key.toPrivateKeyPEM()
const pemPubKey = ins.key.toPublicKeyPEM()
const pem2PubKey = ins2.key.toPublicKeyPEM()

const time = Date.now()
const claims = {
  iss: 'service-a',
  kid: '1',
  data: '123',
  iat: time,
  exp: time + 3600
}

const signRes = njwt.create(claims, pemPriKey, ins.alg)
console.log('signRes ->', signRes.compact())

const verifier = njwt.verify(
  signRes.compact(),
  pem2PubKey,
  ins.alg,
  console.log
)
