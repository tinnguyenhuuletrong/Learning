const bs58 = require('bs58')
const { Ed25519KeyPair } = require('crypto-ld')
const { documentLoaders } = require('jsonld')
const jsigs = require('jsonld-signatures')

// specify the public key object
const publicKey = (id, controller, key) => ({
  '@context': jsigs.SECURITY_CONTEXT_URL,
  type: 'Ed25519VerificationKey2018',
  id,
  controller,
  publicKeyBase58: key
})

const linkPubKey = (id, pubKeys) => ({
  '@context': jsigs.SECURITY_CONTEXT_URL,
  id,
  publicKey: [...pubKeys],
  authentication: [...pubKeys.map(itm => itm.id)]
})

async function signDoc({ doc, creator, privateKeyBase58, publicKeyBase58 }) {
  const { node } = documentLoaders
  const documentLoader = node()

  const { Ed25519Signature2018 } = jsigs.suites
  const { PublicKeyProofPurpose } = jsigs.purposes

  const signed = await jsigs.sign(doc, {
    suite: new Ed25519Signature2018({
      verificationMethod: creator,
      key: new Ed25519KeyPair({ privateKeyBase58, publicKeyBase58 })
    }),
    purpose: new PublicKeyProofPurpose(),
    documentLoader: async url => {
      console.log(url)
      return documentLoader(url)
    }
  })
  return signed
}

async function verifyDoc({ signedDoc, preLoadedDocuments, controller }) {
  const { node } = documentLoaders
  const documentLoader = node()

  const { PublicKeyProofPurpose } = jsigs.purposes
  const { Ed25519Signature2018 } = jsigs.suites

  const mapped = Object.keys(preLoadedDocuments).reduce((acc, key) => {
    return {
      ...acc,
      [key]: {
        context: null,
        document: preLoadedDocuments[key]
      }
    }
  }, {})

  const suites = Object.keys(preLoadedDocuments)
    .filter(key => Boolean(preLoadedDocuments[key].type))
    .map(key => preLoadedDocuments[key])
    .map(
      itm =>
        new Ed25519Signature2018({
          key: new Ed25519KeyPair({ ...itm })
        })
    )

  const result = await jsigs.verify(signedDoc, {
    suite: suites,
    documentLoader: async url => {
      console.log(url)
      if (mapped[url]) return mapped[url]
      return documentLoader(url)
    },
    purpose: new PublicKeyProofPurpose({ controller })
  })
  return result
}

async function start() {
  const publicKeyBase58_1 = 'CXjyVf7diom6ixzDzRfkFPWRdEpa5qibgUBdHB4nEDDP'
  const privateKeyBase58_1 =
    'seXmkgpQ7XMJH3rLWiwtiZuiQoTLuhNf9fsbvVEeQMq6hDJZVpXfxpfBHkaNbtPRdCXt25nNeGjB2zQWc5qjt6R'

  const publicKeyBase58_2 = '26VPhpycm9qg8WnQivxW1dGAhHYox5dqdDDxfji8a4hz'
  const privateKeyBase58_2 =
    '26c96kKGqJYWyoo9FSUXhEdnpfxUd4aztudRKtnnSxmH8J1BbX5Knxyfn52kQDLbkHg2qaruvKyijsSBypbkaxSp'

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

  let signed = await signDoc({
    doc,
    creator: '/ttin/key/1',
    privateKeyBase58: privateKeyBase58_1,
    publicKeyBase58: publicKeyBase58_1
  })

  signed = await signDoc({
    doc,
    creator: '/ttin/key/2',
    privateKeyBase58: privateKeyBase58_2,
    publicKeyBase58: publicKeyBase58_2
  })

  console.log('Signed document:', signed)

  const pubKeyObj1 = publicKey('/ttin/key/1', '/ttin', publicKeyBase58_1)
  const pubKeyObj2 = publicKey('/ttin/key/2', '/ttin', publicKeyBase58_2)

  const pubKeyController = linkPubKey('/ttin', [pubKeyObj1, pubKeyObj2])

  const result = await verifyDoc({
    signedDoc: signed,
    preLoadedDocuments: {
      '/ttin/key/1': pubKeyObj1,
      '/ttin/key/2': pubKeyObj2,
      '/ttin': pubKeyController
    },
    controller: pubKeyController
  })

  console.log(result)
}

start()

// genKeys()
function genKeys() {
  var ins = Ed25519KeyPair.generate()
  console.log(ins)

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
