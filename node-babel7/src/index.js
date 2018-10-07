import { promisify } from 'util'
const sleepPromise = promisify(setTimeout)

async function doSomeThing() {
  await sleepPromise(1000)
  console.log('done')
}

console.log('SOME_ENV', process.env.SOME_ENV)
doSomeThing()
