const fs = require('fs')
const jq = require('node-jq')

async function doTest1(filter, jsonObj) {
  const options = {
    input: 'json',
    output: 'json'
  }
  try {
    let res = await jq.run(filter, jsonObj, options)
    console.log(JSON.stringify(res))
    return res
  } catch (error) {
    throw error
  }
}

const filter = require('./filter')
const jsonObj = JSON.parse(fs.readFileSync('./input.json').toString())
doTest1(filter, jsonObj)
