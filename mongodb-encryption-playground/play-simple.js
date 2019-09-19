const chalk = require('chalk')
const MongoClient = require('mongodb').MongoClient
const { fakeMany } = require('./mock/userMock')
const assert = require('assert')

// Connection URL
const url = 'mongodb://localhost:27017'

// Database Name
const dbName = 'simpleDb'

async function main() {
  // Use connect method to connect to the server
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  console.log(chalk.green('Connected successfully to server'))

  const db = client.db(dbName)
  const collection = db.collection('documents')

  // Cleanup
  let res = await collection.remove({})

  console.log(chalk.blueBright('Remove all documents:'), res.result)

  // Insert
  res = await collection.insertMany(fakeMany(5))

  console.log(chalk.blueBright(`Inserted to ${dbName}.documents:`), res)
  await client.close()
}

main()
