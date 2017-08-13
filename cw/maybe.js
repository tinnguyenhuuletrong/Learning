/////////////////////////////////////////////////////////////////
function Maybe () {
  Object.freeze(this);
};

/////////////////////////////////////////////////////////////////
function Just (x) {
  this.toString = function () { return "Just " + x.toString(); };
  this.just = x;
  Object.freeze(this);
};
Just.prototype = new Maybe();
Just.prototype.constructor = Just;

/////////////////////////////////////////////////////////////////
function Nothing () {
  this.toString = function () { return "Nothing"; };
  Object.freeze(this);
};
Nothing.prototype = new Maybe();
Nothing.prototype.constructor = Nothing;

/////////////////////////////////////////////////////////////////
Maybe.unit = function (x) {
  // return a Maybe that holds x
   if(x)
    return new Just(x)
  return new Nothing()
};

//The @bind function should take the function f which has a single input argument value and returns a Maybe subclass instance. 
//The @bind function should return a new function which takes one Maybe subclass instance as an argument. 
//If the argument is Just x, then the returned function should return (f x). 
//If the argument is Nothing, then the returned function should return Nothing. 
//If the argument is not a Maybe subclass instance, then the returned function should throw an error.
Maybe.bind = function (f) {
  // given a function from a value to a Maybe return a function from a Maybe to a Maybe
  return function(x) { 
    if(x instanceof Nothing)
      return new Nothing()
    else if(x instanceof Just)
      return f(x.just)
    else 
      throw new Error("argument not Maybe")
  }
};

//The @lift function should take the function f which has a single input argument value and returns a value. 
//The @lift function should return a new function of a single argument x that wraps the results of (f x) in a Maybe subclass instance. 
//If evaluation of (f x) throws an exception of any kind, then this function should return a Nothing instances, 
//otherwise it should return a Just instance containing (f x).
Maybe.lift = function (f) {
  // given a function from value to value, return a function from value to Maybe
  // if f throws an exception, (lift f) should return a Nothing

  return function(x) {
    try{
      const res = f(x)
      return new Just(res)
    }
    catch(ex) {
      return new Nothing()
    }
  }
};

// The @do function should take a Maybe subclass instance m and a sequence of functions,
// bind each of the functions using @bind, call the first bound function, 
// pass that value to the second bound function, etc. and return the final function's return value.
Maybe.do = function(m) {
  var fns = Array.prototype.slice.call(arguments, 1);
  // given a Maybe m and some functions fns, run m into the first function,
  // pass that result to the second function, etc. and return the last result
  return fns.reduce((acc, itm) => {
    return Maybe.bind(itm)(acc)
  }, m)
};

//---------------------------------------------------------//
function mDup(str) {
  return new Just(str+str);
}
console.log(mDup("abc").toString());           // => new Just("abcabc")

var bmDup = Maybe.bind(mDup);
console.log(bmDup(new Nothing).toString())   // => new Nothing
console.log(bmDup(new Just("abc")).toString()) // => new Just("abcabc")


function nonnegative(x) {
  if (isNaN(x) || 0 <= x) {
    return x;
  } else {
    throw "Argument " + x + " must be non-negative";
  }
}
var mNonnegative = Maybe.lift(nonnegative)

console.log(mNonnegative(2).toString())           // => new Just 2
console.log(mNonnegative(-1).toString())          // => new Nothing
console.log(mNonnegative(undefined).toString())   // => new Just undefined

var mDup = Maybe.lift( function (s) { return  s+s; } );
var mTrim = Maybe.lift( function (s) { return s.replace(/\s+$/, ''); } );

const res = Maybe.do( Maybe.unit("abc "), mDup, mTrim, mDup )   // => new Just "abc abcabc abc"
console.log(res.toString())


