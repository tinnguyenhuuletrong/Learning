const util = require('util')
const modules = require('bindings')('hello_world')

const iteration = 1000000000
const { libPiSync, libPiAsync } = modules

console.log('[sayHi]', modules.sayHi())
modules.callMe(val => console.log('[callme]', val))
console.log('[nadd]', modules.nadd(10, 5))
console.log('[nobject]', modules.nobject(99.9))

const nativeFunc = modules.nfunc()
console.log('[nfunc]',  `${nativeFunc} -> ${nativeFunc()}`)


const {NativeObject} = modules
const ins = new NativeObject(9)
console.log(util.inspect(NativeObject, true, 3, true))
console.log('[NativeObject.value]', ins.value())
console.log('[NativeObject.multiply]', ins.multiply(20).value())
console.log('[nObjectInspect]', modules.nObjectInspect(ins))

runSync();
runAsync();

function printResult(type, pi, ms) {
    console.log(type, 'method:');
    console.log('\tπ ≈ ' + pi +
        ' (' + Math.abs(pi - Math.PI) + ' away from actual)');
    console.log('\tTook ' + ms + 'ms');
    console.log();
}

function runSync() {
    var start = Date.now();
    // Estimate() will execute in the current thread,
    // the next line won't return until it is finished
    var result = libPiSync(iteration);
    printResult('Sync', result, Date.now() - start);
}

function runAsync() {
    // how many batches should we split the work in to?
    var batches = 64;
    var ended = 0;
    var total = 0;
    var start = Date.now();

    function done(err, result) {
        total += result;
        
        // have all the batches finished executing?
        if (++ended === batches) {
            printResult('Async', total / batches, Date.now() - start);
        }
    }

    const part = iteration / batches
    // for each batch of work, request an async Estimate() for
    // a portion of the total number of calculations
    for (var i = 0; i < batches; i++) {
        libPiAsync(part, done);
    }
}