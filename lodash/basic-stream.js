function Observable(cb) {
  const subscrible = next => cb({ next })
  return { subscrible }
}

const source$ = new Observable(obs => {
  let count = 1
  setInterval(() => obs.next(count++), 1000)
})

source$.subscrible(x => console.log('sub1', x))
source$.subscrible(x => console.log('sub2', x))
