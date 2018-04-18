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
    var sign = await jsig.promises.sign(testDocument, {
        algorithm: 'EcdsaKoblitzSignature2016',
        creator: "hashpubKey",
        privateKeyWif: testPrivateKeyWif,
    })

    console.log("1", sign)

    sign = await jsig.promises.sign(sign, {
        algorithm: 'EcdsaKoblitzSignature2016',
        creator: "hashpubKeyBp",
        privateKeyWif: testPrivateKeyWif,
        // proof: {
        //     "@context": ["http://schema.org", {
        //         "env": "schema:text",
        //         "scAddress": "schema:text"
        //     }],
        //     "scAddress": "rinkeby:0x000",
        //     "env": "sandbox@0.0.1"
        // },
        nonce: "sandbox@0.0.1,rinkeby:0x000"
    })

    console.log("2", sign)


    const ver = await jsig.promises.verify(sign, {
        algorithm: 'EcdsaKoblitzSignature2016',
        checkNonce(nonce, options, callback) {
            console.log("[Nonce]", nonce);

            // init context checking function
            
            options._scChecker = function(owner) {
                console.log("....sc checker by: " + owner)
                return true;
            }
            options._apiChecker = function(keyId) {
                console.log("....Query api by: " + keyId)
                return true;
            }

            callback(null, true);
        },
        publicKey: function (keyId, options, callback) {
            console.log("[Query Key]", keyId);

            // api keyId -> publickey

            options._apiChecker(keyId);

            callback(null, {
                '@context': jsig.SECURITY_CONTEXT_URL,
                id: "hashpubKey",
                owner: 'sc:<service_id>',
                type: 'CryptographicKey',
                publicKeyWif: testPublicKeyWif
            })
        },
        publicKeyOwner: function (owner, options, callback) {
            console.log("[Query Owner]", owner);

            // sc 'sc:<service_id>' -> hashpublickey 
            // place hashpublickey to 'publicKey'

            options._scChecker(owner);

            callback(null, {
                '@context': jsig.SECURITY_CONTEXT_URL,
                id: 'sc:<service_id>',
                publicKey: ["hashpubKey"]
            })
        },
        checkTimestamp: function () { return true }
    })

    console.log(ver)
}

sign();