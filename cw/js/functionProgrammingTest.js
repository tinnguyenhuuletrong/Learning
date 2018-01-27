function add(a) {
    return function (b) {
        return a + b;
    };
}
// console.log(add(1)(2));


function step1(inp) {
    return inp + 1;
}
function step2(inp) {
    return inp * 3;
}

const compose = (...fns) =>
    fns.reverse().reduce((prevFn, nextFn) => {
        return value => nextFn(prevFn(value))
    }, value => value
);

let tmp = compose(step1, step2)
console.log(tmp(10))