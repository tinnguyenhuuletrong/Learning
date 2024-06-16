const path = require('path')
const RUNTIME_PATH = '../index.node'
const dll = require(RUNTIME_PATH)

let count = 1
setInterval(() => {
    console.log('node eventLoop still free', count++)
}, 1000);


Promise.all([
    dll.exec_runjs_async(path.resolve(__dirname, '../samples/fibo.js')).then(() => console.log('> \t [done] fibo')),
    dll.exec_runjs_async(path.resolve(__dirname, '../samples/hello.js')).then(() => console.log('> \t [done] hello.js')),
    dll.exec_runjs_async(path.resolve(__dirname, '../samples/SM_log.js')).then(() => console.log('> \t [done] SM_log')),
    dll.exec_runjs_async(path.resolve(__dirname, '../samples/hello.ts')).then(() => console.log('> \t [done] hello.ts'))
]).then(() => {
    console.log('done all. Bye')
    process.exit(0)
})

