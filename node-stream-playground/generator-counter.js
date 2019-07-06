function* counterGenerator() {
  let count = 0
  while (true) {
    count += 1
    console.log('\t reading:', count)
    yield count
  }
}

const counterIterator = counterGenerator()

const logIterator = async iterator => {
  for (const item of iterator) {
    await new Promise(r => setTimeout(r, 100))
    console.log('writing:', item)
  }
}

logIterator(counterIterator)
