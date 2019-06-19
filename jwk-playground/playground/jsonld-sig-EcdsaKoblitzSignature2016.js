const bs58 = require('bs58')
const { documentLoaders } = require('jsonld')
const jsigs = require('jsonld-signatures')

async function signDoc({ doc, creator, publicKeyWif, privateKeyWif }) {
  const { node } = documentLoaders
  const documentLoader = node()

  const { EcdsaKoblitzSignature2016 } = jsigs.suites
  const { PublicKeyProofPurpose } = jsigs.purposes

  const signed = await jsigs.sign(doc, {
    suite: new EcdsaKoblitzSignature2016({
      privateKeyWif,
      creator,
      publicKeyWif
    }),
    purpose: new PublicKeyProofPurpose(),
    documentLoader
  })
  return signed
}

async function verifyDoc({ signedDoc, preLoadedDocuments, controller }) {
  const { node } = documentLoaders
  const documentLoader = node()

  const { EcdsaKoblitzSignature2016 } = jsigs.suites
  const { PublicKeyProofPurpose } = jsigs.purposes

  const mapped = Object.keys(preLoadedDocuments).reduce((acc, key) => {
    return {
      ...acc,
      [key]: {
        context: null,
        document: preLoadedDocuments[key]
      }
    }
  }, {})

  const result = await jsigs.verify(signedDoc, {
    suite: new EcdsaKoblitzSignature2016(),
    documentLoader: async url => {
      if (mapped[url]) return mapped[url]
      return documentLoader(url)
    },
    purpose: new PublicKeyProofPurpose({ controller })
  })
  return result
}

// specify the public key object
const publicKey = (id, controllerId, key) => ({
  '@context': jsigs.SECURITY_CONTEXT_URL,
  type: 'EcdsaKoblitzSignature2016',
  id: id,
  controller: controllerId,
  publicKeyWif: key
})

const linkPubKey = (id, pubKeys) => ({
  '@context': jsigs.SECURITY_CONTEXT_URL,
  id,
  publicKey: [...pubKeys],
  authentication: [...pubKeys.map(itm => itm.id)]
})

async function start() {
  const publicKeyWif1 = '1GT8x9wGXWkSdqUZYLqEQxsHzWYiAJsqBc'
  const privateKeyWif1 = 'L4X2jCPgEosx4ptU2NBgw1QDUA2Vyyqv6pWmBnNoDJxNz9YQmpYF'

  const publicKeyWif2 = '1ArMR2Gcb3N64RU9cYUKa2pnLz68PnrECq'
  const privateKeyWif2 = 'L1ek6jxECNCoUw38hya7ZpK6uJBousxdw2pLjPkpnkcU72EXSpGh'

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
    publicKeyWif: publicKeyWif1,
    privateKeyWif: privateKeyWif1
  })

  signed = await signDoc({
    doc: signed,
    creator: '/ttin/key/2',
    publicKeyWif: publicKeyWif2,
    privateKeyWif: privateKeyWif2
  })
  console.log(signed)

  const pubKeyObj1 = publicKey('/ttin/key/1', '/ttin', publicKeyWif1)
  const pubKeyObj2 = publicKey('/ttin/key/2', '/ttin', publicKeyWif2)
  const pubKeyController = linkPubKey('/ttin', [pubKeyObj1, pubKeyObj2])

  const verified = await verifyDoc({
    signedDoc: signed,
    preLoadedDocuments: {
      '/ttin/key/1': pubKeyObj1,
      '/ttin/key/2': pubKeyObj2,
      '/ttin': pubKeyController
    },
    controller: pubKeyController
  })
  console.log(verified.results)
}

start()
