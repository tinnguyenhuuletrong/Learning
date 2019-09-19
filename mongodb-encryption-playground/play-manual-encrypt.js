const chalk = require('chalk')
const mongodb = require('mongodb')
const { ClientEncryption } = require('mongodb-client-encryption')(mongodb)
const { MongoClient } = mongodb
const { fakeOne, fakeMany } = require('./mock/userMock')
const assert = require('assert')

// Connection URL
const url = 'mongodb://localhost:27017'

// Database Name
const dbName = 'encryptDb'

// Required to access key
// The master key used for encryption/decryption. A 96-byte long Buffer
const masterKey = Buffer.from(
  '36f5f25d0075971c46c7761128d1cae46ddda21e96a71570e720819d44668191ec23d5b3e45a0af3762ca81aa65e6cacae98b1c49c35215820d7d54e3b57728c766ff3ef57d3da7056e1b201f3f6417cbe794b18604ce1ef39ba8fcd08e38338',
  'hex'
)

function pickRandom(arrValues) {
  return arrValues[Math.floor(Math.random() * arrValues.length)]
}

async function createDataKeys(clientEncrypion) {
  const { _client: client } = clientEncrypion
  const db = client.db('client')
  const collection = db.collection('encryption')

  const availableKeys = await collection.countDocuments({})
  if (availableKeys > 0) {
    console.log(chalk.yellow('Skip key setup.'))
    return
  }
  console.log(chalk.yellow('Setup new keys....'))

  await clientEncrypion.createDataKey('local', {
    keyAltNames: ['key-1']
  })
  await clientEncrypion.createDataKey('local', {
    keyAltNames: ['key-2']
  })
}

async function main() {
  try {
    // Use connect method to connect to the server
    const client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    const clientEncrypion = new ClientEncryption(client, {
      keyVaultNamespace: 'client.encryption',
      kmsProviders: {
        local: {
          key: masterKey
        }
      }
    })
    console.log(chalk.green('Connected successfully to server'))

    const db = client.db(dbName)
    const collection = db.collection('documents')

    // Create 2 Key
    await createDataKeys(clientEncrypion)

    // ---------------------------------
    //  Test encrypt -> write -> decrypt later
    // ---------------------------------
    const ecryptObject = async (obj, keyAltName = 'key-1') => {
      let res = await clientEncrypion.encrypt(obj, {
        keyAltName,
        // The algorithm to use for encryption. Must be either 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic' or AEAD_AES_256_CBC_HMAC_SHA_512-Random'
        algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random'
      })
      console.log(chalk.blueBright('Original:'), obj)
      console.log(chalk.blueBright('Manual encrypted:'), keyAltName, '->', res)
      return {
        encrypted: res
      }
    }

    const decyptObject = async obj => {
      let res = await clientEncrypion.decrypt(obj.encrypted)
      return {
        ...obj,
        decrypted: res
      }
    }

    // Cleanup
    let res = await collection.deleteMany({})
    console.log(chalk.blueBright('Remove all documents:'), res.result)

    // Insert
    const allKeys = ['key-1', 'key-2']
    const allData = await Promise.all(
      fakeMany(5).map(itm => ecryptObject(itm, pickRandom(allKeys)))
    )
    res = await collection.insertMany(allData)
    console.log(chalk.blueBright(`Inserted to ${dbName}.documents:`), res)

    // Read back
    res = await collection.find({}).toArray()
    const originalData = await Promise.all(res.map(itm => decyptObject(itm)))
    console.log(chalk.blueBright(`Read to ${dbName}.documents:`), originalData)

    await client.close()
  } catch (error) {
    console.error(chalk.red('Error'), error)
  }
}

main()

// Note:
//  - AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic Limit(https://docs.mongodb.com/manual/reference/method/ClientEncryption.encrypt/#unsupported-bson-types)
//  - Will crash if `masterKey` wrong - good
