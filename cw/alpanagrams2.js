function factor(n) {
  let f = 1;
  for (var i = 1; i <= n; i++) {
    f *= i;
  }
  return f;
}

function numberDuplicate(arr) {
  let stats = arr.reduce((sum, itm) => {
    if (sum[itm] == null) {
      sum[itm] = 0
    }
    sum[itm]++;
    return sum
  }, {})
  console.log(stats)
  return Object.keys(stats).reduce((sum, itm) => {
    if(stats[itm] > 1)
      return sum * factor(stats[itm])
    return sum
  }, 1)
}

function listPosition(word) {
  //Return the anagram list position of the word
  let arr = Array.from(word).sort()
  let index = 1

  for (var i = 0; i < word.length; i++) {
    const ch = word[i]
    const n = arr.length
    const dupCount = numberDuplicate(arr)
    const ci = arr.indexOf(ch)
    const p = factor(n) / dupCount

    index += ci * p / n

    // console.log(word[i], n, dupCount, p, index, ci, arr)

    arr.splice(ci, 1)
  }

  return index;
}
//---------------------------------------------------------------//

console.log(listPosition('BOOKKEEPER'))

// const arr = Array.from('BAAA')
// const n = factor(arr.length)
// const dup = numberDuplicate(arr)
// console.log(n, dup, n / dup)


// P = (total number of letters)! / (number of repeats)!

// Diference
// Des 
// Set(Des) -> S
// while(n>0)
//    find index Des[i] in set S
//    T = S.length! / (numDuplicate)!
//    A += i * T / n
//    remove Des[i] in S
//    n--