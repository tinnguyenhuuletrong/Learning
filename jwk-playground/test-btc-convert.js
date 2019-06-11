const { convertBtcPrivateWipToJws } = require('./index')

const res = convertBtcPrivateWipToJws({
  keyID: '1',
  privateKeyWIP: 'L1SfrY4D8V3qcMYFKYsGNt6ZgR75fdsBNeW9ZNgytYyN752ZXW3h',
  isPubKeyOnly: true
})

console.log(res)
