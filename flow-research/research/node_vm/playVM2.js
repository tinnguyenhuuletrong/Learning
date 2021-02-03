const vm = require('vm')
const src = `
function* generator() {
  yield 1;
  yield 2;
  yield 3;

  throw new Error('aaaa')
}
ins = generator()
`

const script = new vm.Script(src)
const context = {}
script.runInNewContext(context)

console.log('context', context)
console.log('context', context.ins.next())
console.log('context', context.ins.next())

/// Save
const cachedData = script.createCachedData()
console.dir(
  {
    context,
    cachedData,
  },
  { depth: 10 }
)

// Load
const script2 = new vm.Script(src, { filename: 'some_debug_name' })
const context2 = {}
script2.runInNewContext(context2)
console.log('context2', context2.ins.next())
console.log('context2', context2.ins.next())
console.log('context2', context2.ins.next())
console.log('context2', context2.ins.next())
