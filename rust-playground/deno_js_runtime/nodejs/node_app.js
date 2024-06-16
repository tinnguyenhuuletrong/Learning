const path = require('path')
const RUNTIME_PATH = '../index.node'
const dll = require(RUNTIME_PATH)

const filePath = path.resolve(__dirname, '../samples/SM_log.js')
console.log(dll.exec_runjs(filePath))