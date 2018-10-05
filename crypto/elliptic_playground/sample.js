var EC = require('elliptic').ec

// Create and initialize EC context
// (better do it once and reuse it)
var ec = new EC('secp256k1')

// Generate keys
var key = ec.genKeyPair()

// Sign the message's hash (input must be an array, or a hex-string)
var msgHash = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
var signature = key.sign(msgHash)

// Export DER encoded signature in Array
var derSign = signature.toDER()

console.log(Buffer.from(derSign).toString('hex'))
console.log('priv:', key.getPrivate())
console.log('pub:', key.getPublic())

// Verify signature
console.log(key.verify(msgHash, derSign))

// CHECK WITH NO PRIVATE KEY

var pubPoint = key.getPublic()
var x = pubPoint.getX()
var y = pubPoint.getY()

// Public Key MUST be either:
// 1) '04' + hex string of x + hex string of y; or
// 2) object with two hex string properties (x and y); or
// 3) object with two buffer properties (x and y)
var pub = pubPoint.encode('hex') // case 1
var pub = { x: x.toString('hex'), y: y.toString('hex') } // case 2
var pub = { x: x.toBuffer(), y: y.toBuffer() } // case 3
var pub = { x: x.toArrayLike(Buffer), y: y.toArrayLike(Buffer) } // case 3

// Import public key
var key = ec.keyFromPublic(pub, 'hex')

// Signature MUST be either:
// 1) DER-encoded signature as hex-string; or
// 2) DER-encoded signature as buffer; or
// 3) object with two hex-string properties (r and s); or
// 4) object with two buffer properties (r and s)

var signature = Buffer.from(derSign).toString('hex') // case 1
// var signature = new Buffer('...') // case 2
// var signature = { r: 'b1fc...', s: '9c42...' } // case 3

// Verify signature
console.log(key.verify(msgHash, signature))
