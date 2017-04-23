//---------------------------------------------------------------//
// Composition Function
//---------------------------------------------------------------//
const compose = (...functions) => data => 
    functions.reduceRight((value, func) => func(value), data)

const pipe = (...functions) => data => 
    functions.reduce((value, func) => func(value), data)

//---------------------------------------------------------------//
// Example
//---------------------------------------------------------------//

const add = x => y => x + y
const multiply = x => y => x * y

// => (x + 2) * 3
//const add2Multiply3 = compose(multiply(3), add(2))
const add2Multiply3 = pipe(add(2), multiply(3))

console.log(add2Multiply3(2))