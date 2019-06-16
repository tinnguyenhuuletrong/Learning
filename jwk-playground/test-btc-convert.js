const {
  convertBtcPrivateWipToJwk,
  jwkToBtcPrivateWip,
  jwkToBtcAddressCompressed,
  JWK
} = require('./lib/utils')

const res = convertBtcPrivateWipToJwk({
  keyID: '1',
  privateKeyWIP: '5JmnWMBF5R2YrhT7R98Jz4semGtDqdSsP88xrvrPQTjDwSs9CG1',
  isPubKeyOnly: false
})

console.log(res)
console.log(jwkToBtcPrivateWip(res))
console.log(jwkToBtcAddressCompressed(res))
