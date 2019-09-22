const chalk = require('chalk')
const mongodb = require('mongodb')
const { AutoEncrypter } = require('mongodb-client-encryption')(mongodb)
const { MongoClient } = mongodb
const { fakeOne, fakeMany } = require('./mock/userMock')
const assert = require('assert')

// Connection URL
const url = 'mongodb://localhost:27017'

// Database Name
const dbName = 'encryptDb2'

// Required to access key
// The master key used for encryption/decryption. A 96-byte long Buffer
const masterKey = Buffer.from(
  '36f5f25d0075971c46c7761128d1cae46ddda21e96a71570e720819d44668191ec23d5b3e45a0af3762ca81aa65e6cacae98b1c49c35215820d7d54e3b57728c766ff3ef57d3da7056e1b201f3f6417cbe794b18604ce1ef39ba8fcd08e38338',
  'hex'
)

function pickRandom(arrValues) {
  return arrValues[Math.floor(Math.random() * arrValues.length)]
}

async function createDataKeys(clientEncrypion) {}

async function main() {
  try {
    // Use connect method to connect to the server
    const client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoEncryption: {
        keyVaultNamespace: 'client.encryption',
        kmsProviders: {
          local: {
            key: masterKey
          }
        }
      }
    })

    console.log(chalk.green('Connected successfully to server'))

    await client.close()
  } catch (error) {
    console.error(chalk.red('Error'), error)
    process.exit(0)
  }
}

main()
