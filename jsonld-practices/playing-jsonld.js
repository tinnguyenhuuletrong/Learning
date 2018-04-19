var jsonld = require('jsonld');
var jsig = require('jsonld-signatures');
jsig.use('jsonld', jsonld);

const testDocument = {
    "@context": [{
        "@version": 1.1,
    },
        "http://schema.org",
        "https://w3id.org/security/v2",
    {
        'Claim': { '@type': 'schema:Review' }
    }],

    "Person": {
        "scId": "qweoiqwekjasdkjnasd",
        "transactionId": "yyyyyyy",
        "rootHash": "zxzxczxczxc",
        "givenName": "axasxasqweqweqwe",
        "familyName": "werwerwerwerwerwer",
        "phone": "123123123123",
        "email": "asdzxczxcadasd"
    },

    "Organization": {
        "identifier": "service_xxxxxx",
        "legalName": "abc cooperation",
        "logo": "http://abc.logo.com/img"
    },

    "Claim": {
        "identifier": "internal service id",
        "image": "base64:Image here",
        "reviewBody": "markdown review comments",
        "accessMode": "A",
        "expires": "20/03/2010",
        "_customFields": {

        }
    }
}

testPrivateKeyWif = 'L4mEi7eEdTNNFQEWaa7JhUKAbtHdVvByGAqvpJKC53mfiqunjBjw';
testPublicKeyWif = '1LGpGhGK8whX23ZNdxrgtjKrek9rP4xWER';

async function sign() {

    // 1st Sign by services
    var sign = await jsig.promises.sign(testDocument, {
        algorithm: 'EcdsaKoblitzSignature2016',
        creator: "hashPubKeyServices01",
        privateKeyWif: testPrivateKeyWif,
    })

    console.log("1", sign)

    // 2st Sign by blockpass
    sign = await jsig.promises.sign(sign, {
        algorithm: 'EcdsaKoblitzSignature2016',
        creator: "hashPubKeyBp01",
        privateKeyWif: testPrivateKeyWif,
        nonce: "sandbox@0.0.1,rinkeby:0x000"
    })

    console.log("2", sign)

    // verify procedures
    const ver = await jsig.promises.verify(sign, {
        algorithm: 'EcdsaKoblitzSignature2016',
        checkNonce(nonce, options, callback) {
            console.log("[Nonce]", nonce);
            const FAKE_OWNER = [
                {
                    serviceId: "01",
                    scId: "0x01",
                    keyIds: [{
                        index: 0,
                        pubKey: testPublicKeyWif,
                        hashPubKey: '/hashPubKeyServices01'
                    }],
                },
                {
                    serviceId: "bp",
                    scId: "0x02",
                    keyIds: [{
                        index: 0,
                        pubKey: testPublicKeyWif,
                        hashPubKey: '/hashPubKeyBp01'
                    }],
                }
            ]

            const SC_FAKE = {
                "/0x01@0": "hashPubKeyServices01",
                "/0x02@0": "hashPubKeyBp01",
            }

            // init context checking function
            options._apiChecker = function (keyId) {
                console.log("....Query api by: " + keyId)

                const itm = FAKE_OWNER.find(itm => itm.keyIds.find(key => key.hashPubKey === keyId));
                const index = itm.keyIds.filter(key => key.hashPubKey === keyId)[0].index
                return {
                    owner: `${itm.scId}@${index}`,
                    publickey: itm.keyIds[index].pubKey
                };
            }

            options._scChecker = function (owner) {
                console.log("....sc checker by: " + owner)

                return SC_FAKE[owner]
            }


            callback(null, true);
        },
        publicKey: function (creator, options, callback) {
            console.log("[Query Key]", creator);

            // api creator -> publickey
            const res = options._apiChecker(creator);

            callback(null, {
                '@context': jsig.SECURITY_CONTEXT_URL,
                id: creator,
                owner: res.owner,
                type: 'CryptographicKey',
                publicKeyWif: res.publickey
            })
        },
        publicKeyOwner: function (owner, options, callback) {
            console.log("[Query Owner]", owner);

            // scId -> hashpublickey 
            const res = options._scChecker(owner);
            
            callback(null, {
                '@context': jsig.SECURITY_CONTEXT_URL,
                id: owner,
                publicKey: [res]
            })
        },
        checkTimestamp: function () { return true }
    })

    console.log(ver)
}

sign();