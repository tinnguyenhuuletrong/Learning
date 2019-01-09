var PouchDB = require('pouchdb-node')
PouchDB.plugin(require('pouchdb-find'))

var db = new PouchDB('db')

async function test1() {
  try {
    // Need specify Id
    const id = Date.now().toString()
    const resAdd = await db.put({
      _id: id,
      title: 'Heroes'
    })
    console.log('put:', resAdd)

    const resGet = await db.get(id)
    console.log('get:', resGet)

    // Auto generate ID
    const resAdd1 = await db.post({
      title: 'Super Hero'
    })
    console.log('post:', resAdd1)

    const resGet1 = await db.get(resAdd1.id)
    console.log('get:', resGet1)
  } catch (error) {
    console.log(error)
  }
}

async function updateWith(docId, data) {
  const doc = await db.get(docId)
  return await db.put({
    ...doc,
    ...data
  })
}

async function test2() {
  try {
    // Auto generate ID
    let res = await db.post({
      title: 'Super Hero',
      latestChapter: 1
    })

    const { id, rev } = res
    const revHistory = [rev]
    res = await updateWith(id, { latestChapter: 2 })
    revHistory.push(res.rev)
    res = await updateWith(id, { latestChapter: 3 })
    revHistory.push(res.rev)
    res = await updateWith(id, { latestChapter: 4 })
    revHistory.push(res.rev)

    for (const iterator of revHistory) {
      res = await db.get(id, {
        rev: iterator
      })
      console.log(iterator, '->', res)
    }

    res = await db.get(id, { revs_info: true })
    console.log('HEAD', '->', res)

    // Compact -> Drop old rev
    console.log('Compact...')
    await db.compact()

    res = await db.get(id, { revs_info: true })
    console.log('HEAD', '->', res)
  } catch (error) {
    console.error(error)
  }
}

async function test3() {
  try {
    // Auto generate ID
    let res = await db.post({
      title: 'Ironman',
      cat: 'comic',
      latestChapter: 1
    })

    res = await db.post({
      title: 'Spiderman',
      cat: 'comic',
      latestChapter: 1
    })

    res = await db.post({
      title: 'Captain',
      cat: 'comic',
      latestChapter: 1
    })

    res = await db.post({
      title: 'Thor',
      cat: 'comic',
      latestChapter: 1
    })

    db.createIndex({
      index: { fields: ['cat'] }
    })

    res = await db.find({
      selector: {
        cat: 'comic'
      },
      fields: ['title', 'latestChapter']
    })

    console.log(res)
  } catch (error) {
    console.error(error)
  }
}

test3()
