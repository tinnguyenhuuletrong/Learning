const { EcdsaKoblitzSignature2016 } = require('jsonld-signatures').suites

class VerifyMultiEcdsaKoblitzSignature2016 extends EcdsaKoblitzSignature2016 {
  constructor({
    privateKeyWif,
    publicKeyWif,
    creator,
    date,
    domain,
    nonce,
    useNativeCanonize
  } = {}) {
    super({
      privateKeyWif,
      publicKeyWif,
      creator,
      date,
      domain,
      nonce,
      useNativeCanonize
    })
    this.db = {}
  }

  async verifySignature({ verifyData, proof }) {
    this.publicKeyWif = this.db[proof.creator]
    return super.verifySignature({ verifyData, proof })
  }

  async getVerificationMethod({ proof, documentLoader }) {
    const verificationMethod = await super.getVerificationMethod({
      proof,
      documentLoader
    })
    if (typeof verificationMethod.publicKeyWif !== 'string') {
      throw new TypeError(
        'Unknown public key encoding. Public key encoding must be ' +
          '"publicKeyWif".'
      )
    }

    if (verificationMethod.publicKeyWif) {
      this.db[verificationMethod.id] = verificationMethod.publicKeyWif
    }

    return verificationMethod
  }
}

module.exports = VerifyMultiEcdsaKoblitzSignature2016
