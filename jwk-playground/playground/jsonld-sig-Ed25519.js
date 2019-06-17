const bs58 = require('bs58')
const { Ed25519KeyPair } = require('crypto-ld')
const { documentLoaders } = require('jsonld')
const jsigs = require('jsonld-signatures')

async function start() {
  const publicKeyBase58 = 'CXjyVf7diom6ixzDzRfkFPWRdEpa5qibgUBdHB4nEDDP'
  const privateKeyBase58 =
    'seXmkgpQ7XMJH3rLWiwtiZuiQoTLuhNf9fsbvVEeQMq6hDJZVpXfxpfBHkaNbtPRdCXt25nNeGjB2zQWc5qjt6R'

  // specify the public key object
  const publicKey = {
    '@context': jsigs.SECURITY_CONTEXT_URL,
    type: 'Ed25519VerificationKey2018',
    id: 'https://example.com/i/alice/keys/2',
    controller: 'https://example.com/i/alice',
    publicKeyBase58
  }

  // specify the public key controller object
  const controller = {
    '@context': jsigs.SECURITY_CONTEXT_URL,
    id: 'https://example.com/i/alice',
    publicKey: [publicKey],
    // this authorizes this key to be used for authenticating
    authentication: [publicKey.id]
  }

  // create the JSON-LD document that should be signed
  const doc = {
    '@context': [
      {
        '@version': 1.1
      },
      'https://qa-api.blockpass.org/api/schema/complyadvantage-service-cert',
      'https://w3id.org/security/v2'
    ],
    Entity: {
      type: 'person',
      familyName:
        '213c4d2db026ed435600846708e0d056658f34fab86071f297925e534d209325',
      givenName:
        '6377a611414395082b002257f8b0d7e7cc684a674d177483e95fd2bdf1f35a26',
      dob: '1a9b9a13627794f558126a1671ed5cff6271e1d18773e14edd5bcd1934571435',
      rootHash:
        '7b76e8e82157986a4a82c5415589ece77ea4b53874720c83fb53687fa2f06d45'
    }
  }

  // we will need the documentLoader to verify the controller
  const { node } = documentLoaders
  const documentLoader = node()

  // sign the document for the purpose of authentication
  const { Ed25519Signature2018 } = jsigs.suites
  const { PublicKeyProofPurpose } = jsigs.purposes

  const signed = await jsigs.sign(doc, {
    documentLoader,
    suite: new Ed25519Signature2018({
      verificationMethod: publicKey.id,
      key: new Ed25519KeyPair({ privateKeyBase58, publicKeyBase58 })
    }),
    purpose: new PublicKeyProofPurpose()
  })

  console.log('Signed document:', signed)

  // verify the signed document
  const result = await jsigs.verify(signed, {
    documentLoader,
    suite: new Ed25519Signature2018({
      key: new Ed25519KeyPair(publicKey)
    }),
    purpose: new PublicKeyProofPurpose({ controller })
  })
  if (result.verified) {
    console.log('Signature verified.')
  } else {
    console.log('Signature verification error:', result.error)
  }
}

start()

// genKeys()
function genKeys() {
  // var ins = Ed25519KeyPair.generate()
  // console.log(ins)

  //http://ed25519.herokuapp.com/
  console.log(
    'Pub',
    bs58.encode(
      Buffer.from('q1CSRJ6w+XXPGrkn1fwy3CFVcNXJItqRJvDS4n+UE7Y=', 'base64')
    )
  )
  console.log(
    'Priv',
    bs58.encode(
      Buffer.from(
        'K60WD5E7O+np04UFJffb0sHz8paJA1UWklBsxcUiZL2rUJJEnrD5dc8auSfV/DLcIVVw1cki2pEm8NLif5QTtg==',
        'base64'
      )
    )
  )
}
