AsyncArray = require("./lib/AsyncArray.js")



const DATA = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

//  Processing 1
//  1. Map x3 
//  2. Filter even number
//  3. ForEach and Printf

const job = new AsyncArray(Promise.resolve(DATA))

function delayPromise(delta, arg) {
    return new Promise((resolve, reject) => {
        setTimeout(_ => resolve(arg), delta)
    })
}

const res = job.mapAsync(itm => {
    return delayPromise(itm * 100, itm * 3)
})
    .filterAsync(val => {
        return delayPromise(val * 10, val % 2 == 0)
    })
    .forEachAsync(val => {
        console.log(val)
    })
res.then(res => {
    console.log("(1) All Done!", res)
})

//  Processing 2
//  1. Filter odd number
//  2. Reduce -> sum

const job2 = new AsyncArray(Promise.resolve(DATA))
const res2 = job.filterAsync(val => {
    return delayPromise(val * 200, val % 2 != 0)
})
    .reduceAsync((sum, v, i) => {
        return sum += v;
    }, 0)
    .then(sum => {
        console.log("(2) Job Done!", sum)
    })
