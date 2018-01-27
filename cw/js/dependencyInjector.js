//http://www.codewars.com/kata/dependency-injection/train/javascript

/**
 * Constructor DependencyInjector
 * @param {Object} - object with dependencies
 */
var DI = function (dependency) {
    this.dependency = dependency;
};

// Should return new function with resolved dependencies
DI.prototype.inject = function (func) {
    const injectedArgs = this._getArgs(func).map(itm => this.dependency[itm]);
    return func.bind(null, ...injectedArgs);
}

DI.prototype._getArgs = function (func) {
    var args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];
    return args.split(',').map(function (arg) {
        return arg.replace(/\/\*.*\*\//, '').trim();
    }).filter(function (arg) {
        return arg;
    });
}



// console.log(test.apply())

let test1 = new DI({
    dep1: () => 'dep1 ins',
    dep2: () => 'dep2 ins',
    dep3: () => 'dep3 ins',
})

function testFunc(dep3, dep1, dep2) {
    return [dep1(), dep2(), dep3()].join(' -> ');
}

console.log(test1.inject(testFunc)())