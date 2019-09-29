const chalk = require('chalk')
const mongodb = require('mongodb')
const { ClientEncryption } = require('mongodb-client-encryption')(mongodb)
const { MongoClient } = mongodb
const { fakeOne, fakeMany } = require('./mock/userMock')
const assert = require('assert')

/* Required those value from .env file
AWS_ACCESS_KEY
AWS_SECRET_KEY
MASTER_KEY_ARN
*/
require('dotenv').config()

// Connection URL
const url = 'mongodb://localhost:27017'

// Database Name
const dbName = 'encryptDbKms'

const MASTER_KEY_ARN = process.env.MASTER_KEY_ARN

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
        aws: {
          accessKeyId: process.env.AWS_ACCESS_KEY,
          secretAccessKey: process.env.AWS_SECRET_KEY
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
    const allKeys = ['key-1', 'key-2', 'key-3']
    const allData = await Promise.all(
      fakeMany(10).map(itm => ecryptObject(itm, pickRandom(allKeys)))
    )
    res = await collection.insertMany(allData)
    console.log(chalk.blueBright(`Inserted to ${dbName}.documents:`), res)

    // Read back
    res = await collection.find({}).toArray()
    const originalData = await Promise.all(res.map(itm => decyptObject(itm)))
    console.log(chalk.blueBright(`Read to ${dbName}.documents:`), originalData)

    await client.close()
  } catch (err) {
    console.error(err)
  }
}

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

  await clientEncrypion.createDataKey('aws', {
    masterKey: {
      region: 'us-east-2',
      key: MASTER_KEY_ARN // CMK ARN here
    },
    keyAltNames: ['key-1']
  })
  await clientEncrypion.createDataKey('aws', {
    masterKey: {
      region: 'us-east-2',
      key: MASTER_KEY_ARN // CMK ARN here
    },
    keyAltNames: ['key-2']
  })
  await clientEncrypion.createDataKey('aws', {
    masterKey: {
      region: 'us-east-2',
      key: MASTER_KEY_ARN // CMK ARN here
    },
    keyAltNames: ['key-3']
  })
}

main()
