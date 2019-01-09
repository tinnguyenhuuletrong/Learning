const Automerge = require('automerge')
const util = require('util')

function client1(context) {
  let docNew = Automerge.change(context.doc, 'init', doc => {
    doc.tasks = []
  })
  docNew = Automerge.change(docNew, 'add-task', doc => {
    doc.tasks.push({
      taskId: 1,
      content: 'content1',
      title: 'title1',
      done: false
    })
  })

  context.changes = Automerge.getChanges(context.doc, docNew)
  context.doc = docNew
  return docNew
}

function client2(context, changes) {
  let doc = Automerge.applyChanges(context.doc, changes)
  docNew = Automerge.change(doc, 'add-another', doc => {
    doc.tasks.push({
      taskId: 2,
      content: 'content2',
      title: 'title2',
      done: false
    })
  })

  docNew = Automerge.change(docNew, 'modify_title-c2', doc => {
    doc.tasks[0].title = 'change-from-c2'
  })

  context.changes = Automerge.getChanges(context.doc, docNew)
  context.doc = docNew
  return docNew
}

function client1_1(context, changes) {
  let docNew = Automerge.change(context.doc, 'modify_title-c1', doc => {
    doc.tasks[0].title = 'change-from-c1'
  })

  docNew = Automerge.applyChanges(docNew, changes)

  context.changes = Automerge.getChanges(context.doc, docNew)
  context.doc = docNew
  return docNew
}

const context1 = { doc: Automerge.init() }
const context2 = { doc: Automerge.init() }
// Step1: client1 create doc -> sync client2
let doc1 = client1(context1)
let doc2 = client2(context2, context1.changes)

console.log('step1: ', doc1, doc2)
// Step2: client1 and client 2 change on same field

client1_1(context1, context2.changes)
console.log('step2: ', Automerge.getConflicts(context2.doc))
