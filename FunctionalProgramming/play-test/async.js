//http://thecodebarbarian.com/basic-functional-programming-with-async-await.html

function simpleForEach(arrayData, doJob) {
    arrayData.forEach(doJob);
}

//-------------------------------------------------//
// Foreach Async
//-------------------------------------------------//
function foreachAsync(arrayData, doJob) {
    arrayData.reduce((promise, item) => {
        return Promise.resolve(promise)
            .then(res => {
                return doJob(item)
            })
    }, Promise.resolve())
}

//-------------------------------------------------//
// Map Async
//-------------------------------------------------//
function mapAsync(arrayData, doJob) {
    return Promise.all(arrayData.map(doJob))
}

function filterAsync(arrayData, doJob) {
    return mapAsync(arrayData, doJob)
        .then(_arr => {
            return arrayData.filter((v, i) => !!_arr[i])
        })
}

//-------------------------------------------------//
const BeginTime = Date.now();
const DATA = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

function jobWithDelay(n) {
    return new Promise(resolve => setTimeout(() => {
        console.log(`TimeSinceBegin ${Date.now() - BeginTime}: `, n);
        resolve(n * 2)
    }, 1000 - n * 100));
}

function jobWithDelayFilter(n) {
    return new Promise(resolve => setTimeout(() => {
        console.log(`TimeSinceBegin ${Date.now() - BeginTime}: `, n);
        resolve(n % 2 === 0)
    }, 1000 - n * 100));
}

function _playWithForEach() {
    DATA.forEach(itm => {
        console.log(itm)
    });
    foreachAsync(DATA, jobWithDelay)
}

function _playWithMap() {
    // let res = DATA.map(jobWithDelay)
    // console.log("map: ", res);

    let res1 = mapAsync(DATA, jobWithDelay)
    res1.then(data => {
        console.log("mapAsync: ", data)
    })
}

function _playWithFilter() {
    let res = filterAsync(DATA, jobWithDelayFilter)
    res.then(data => {
        console.log("filterAsync: ", data)
    })
}

// _playWithForEach();
// _playWithMap();
_playWithFilter();


