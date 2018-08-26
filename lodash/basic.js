const lo = require('lodash')

function arrayMethods() {
  const a = [1, 2, 3, 4, 5]
  const b = [1, 3]
  console.log('difference:', a, b, '->', lo.difference(a, b))
  console.log('drop', a, '->', lo.drop(a, 2))
  console.log('fromPairs', lo.fromPairs([['a', 1], ['b', 2]]))
  console.log('intersection', '->', lo.intersection([2, 1], [2, 3]))
  console.log(
    'binary search sorted index',
    [30, 50, 90, 100],
    40,
    '->',
    lo.sortedIndex([30, 50, 90, 100], 40)
  )

  const p3 = [['a', 'b', 'c'], [1, 2, 3], [{ e: 1 }, { e: 2 }, { e: 3 }]]
  console.log('zip', p3[0], p3[1], p3[2], '\n->', lo.zip(...p3))

  console.log(
    'zipWith sum',
    [1, 2],
    [10, 20],
    [100, 200],
    '->',
    lo.zipWith([1, 2], [10, 20], [100, 200], (a, b, c) => a + b + c)
  )
}

function collectionMethods() {
  console.log('countBy', lo.countBy(['a', 'b', 'c', 'd', 'a']))
  console.log('flatMap', lo.flatMap([1, 2], a => [a, a]))

  // GroupBy
  const p = [
    {
      name: 'a',
      cat: '1'
    },
    {
      name: 'b',
      cat: '1'
    },
    {
      name: 'c',
      cat: '2'
    }
  ]
  console.log('groupBy', lo.groupBy(p, 'cat'))

  // Sort by `user` in ascending order and by `age` in descending order.
  const users = [
    { user: 'fred', age: 48 },
    { user: 'barney', age: 34 },
    { user: 'fred', age: 40 },
    { user: 'barney', age: 36 }
  ]
  console.log('orderBy', lo.orderBy(users, ['user', 'age'], ['asc', 'desc']))
}

function objectMethods() {
  var object = {
    a: [
      {
        b: { c: 3 }
      },
      4
    ],
    x: 'hello'
  }

  console.log(
    'object at (return array):',
    '[a[0].b.c, a[1]]',
    '->',
    lo.at(object, ['a[0].b.c', 'a[1]'])
  )
  console.log('object at (return array):', 'x', '->', lo.at(object, 'x'))
}

objectMethods()
