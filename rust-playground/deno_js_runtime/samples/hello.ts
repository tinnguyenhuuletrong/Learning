import type {} from '../jsRuntime/type'

console.log("hello from deno core!. TS file")
runjs.say()
console.log("😴 ZzZ for 2 seconds")
await setTimeout(2000)
console.log("Bye!")