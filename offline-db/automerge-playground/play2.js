const Automerge = require('automerge')
let doc1 = Automerge.change(Automerge.init(), '1-1', doc => {
  doc.x = 1
})
let doc2 = Automerge.change(Automerge.init(), '1-2', doc => {
  doc.x = 2
})
doc1 = Automerge.merge(doc1, doc2)
doc2 = Automerge.merge(doc2, doc1)

// Auto resolve conflict
console.log(doc1, doc2)
