// http://www.codewars.com/kata/symbolic-differentiation-of-prefix-expressions/train/javascript

const OPERATORS = ['+', '-', '*', '/', '^'];
const FUNCTIONS = ['cos', 'sin', 'exp', 'ln', 'tan'];
const VARIABLES = ['x']


//------------------------------------------------------------------//
// D Tables
//------------------------------------------------------------------//
const DFunctionsTable = {}
DFunctionsTable['x'] = function (tokens) { return ['1']; }
DFunctionsTable['constant'] = function () { return ['0']; }

// ( a f (x) + bg(x) ) ' = a f ' (x) + bg' (x)
DFunctionsTable['+'] = function (tokens) {
  const exp1 = expression(tokens);
  const exp2 = expression(tokens);

  const dexp1 = diffExpression(exp1.slice(0));
  const dexp2 = diffExpression(exp2.slice(0));

  return expressionReduce(['+', dexp1, dexp2]);
}

// ( a f (x) - bg(x) ) ' = a f ' (x) - bg' (x)
DFunctionsTable['-'] = function (tokens) {
  const exp1 = expression(tokens);
  const exp2 = expression(tokens);

  const dexp1 = diffExpression(exp1.slice(0));
  const dexp2 = diffExpression(exp2.slice(0));

  return expressionReduce(['-', dexp1, dexp2]);
}

// 	( f (x) ∙ g(x) ) ' = f ' (x) g(x) + f (x) g' (x)
DFunctionsTable['*'] = function (tokens) {
  const exp1 = expression(tokens);
  const exp2 = expression(tokens);

  const dexp1 = diffExpression(exp1.slice(0));
  const dexp2 = diffExpression(exp2.slice(0));

  let leftVal = expressionReduce(['*', exp1, dexp2]);
  let rightVal = expressionReduce(['*', dexp1, exp2]);

  return expressionReduce(['+', leftVal, rightVal]);
}

// (a ^ x)' = a x a-1
DFunctionsTable['^'] = function (tokens) {
  const exp1 = expression(tokens);
  const exp2 = expression(tokens);

  if (exp2 - 1 == 1)
    return expressionReduce(['*', exp2, exp1])

  let rightVal = expressionReduce(['^', exp1, exp2 - 1]);

  return expressionReduce(['*', exp2, rightVal]);
}

//\left ( \frac{f(x)}{g(x)} \right )'=\frac{f'(x)g(x)-f(x)g'(x)}{g^2(x)}
DFunctionsTable['/'] = function (tokens) {
  const exp1 = expression(tokens);
  const exp2 = expression(tokens);

  const dexp1 = diffExpression(exp1.slice(0));
  const dexp2 = diffExpression(exp2.slice(0));

  let leftVal = expressionReduce(['*', dexp1, exp2]);
  let rightVal = expressionReduce(['*', dexp2, exp1]);
  let upVal = expressionReduce(['-', leftVal, rightVal]);
  let downVal = expressionReduce(['^', exp2, ['2']]);

  return expressionReduce(['/', upVal, downVal]);
}

//sin x -> x' * cos x
DFunctionsTable['sin'] = function (tokens) {
  const exp = expression(tokens);
  const dexp = diffExpression(exp.slice(0));

  const subExp = expressionReduce(['cos', exp]);
  return expressionReduce(['*', dexp, subExp]);
}

//cos x -> x' * -1 * sin x
DFunctionsTable['cos'] = function (tokens) {
  const exp = expression(tokens);
  const dexp = diffExpression(exp.slice(0));

  const tmp = expressionReduce(['sin', exp]);
  const subExp = expressionReduce(['*', '-1', tmp]);
  return expressionReduce(['*', dexp, subExp]);
}

//exp x -> exp x
DFunctionsTable['exp'] = function (tokens) {
  const exp = expression(tokens);
  const dexp = diffExpression(exp.slice(0));
  const subExp = expressionReduce(['exp', exp]);
  return expressionReduce(['*', dexp, subExp]);
}

//ln x -> 1/x
DFunctionsTable['ln'] = function (tokens) {
  const exp = expression(tokens);
  const dexp = diffExpression(exp.slice(0));
  const subExp = expressionReduce(['/', '1', exp]);
  return expressionReduce(['*', dexp, subExp]);
}

// tan x -> 1 + tan(x)^2
DFunctionsTable['tan'] = function (tokens) {
  const exp = expression(tokens);
  const dexp = diffExpression(exp.slice(0));
  const subExp1 = expressionReduce(['tan', exp]);
  const subExp2 = expressionReduce(['^', subExp1, 2]);

  const subExp = expressionReduce(['+', 1, subExp2]);
  return expressionReduce(['*', dexp, subExp]);
}

// Evaluate value
function evaluateParam(val) {
  if (val == null)
    return null;

  // variable
  if (VARIABLES.indexOf(val) != -1)
    return {
      v: val,
      t: 2, //'variable',
      val: _ => [val]
    };

  // expression
  if (Array.isArray(val))
    return {
      v: val,
      t: 1, //'expression'
      val: _ => val
    };

  // number
  return {
    v: parseInt(val),
    t: 0, //'num',
    val: _ => [parseInt(val)]
  };
}

// reduce expression
function expressionReduce(exp) {
  // forward null OR constant value
  if (exp == null || !Array.isArray(exp))
    return exp;

  const tmp = exp.slice(0);
  const op = tmp.shift();

  // Expression -> Expression
  if (op == '(')
    return exp;

  // Varialble -> Variable
  if (VARIABLES.indexOf(op) != -1)
    return op;

  // Reduce Params
  let exp1 = expressionReduce(tmp.shift());
  let exp2 = expressionReduce(tmp.shift());

  // Evaluate
  let arg1 = evaluateParam(exp1);
  let arg2 = evaluateParam(exp2);

  // Apply Operator
  switch (op) {
    case '+':
      {
        if (arg1.v === 0)
          return arg2.val();
        else if (arg2.v === 0)
          return arg1.val();
        else if (arg1.t + arg2.t !== 0)
          return [].concat('(', op, arg1.val(), arg2.val(), ')');
        return [arg1.v + arg2.v];
      }
      break;
    case '-':
      {
        if (arg1.t + arg2.t !== 0)
          return [].concat('(', op, arg1.val(), arg2.val(), ')');
        return [arg1.v - arg2.v];
      }
      break;
    case '*':
      {
        if (arg1.v === 0 || arg2.v === 0)
          return [0];
        else if (arg1.v === 1)
          return arg2.val();
        else if (arg2.v === 1)
          return arg1.val();
        else if (arg1.t + arg2.t !== 0)
          return [].concat('(', op, arg1.val(), arg2.val(), ')');
        return [arg1.v * arg2.v];
      }
      break;
    case '/':
      {
        if (arg1.t + arg2.t !== 0)
          return [].concat('(', op, arg1.val(), arg2.val(), ')');
        return [arg1.v / arg2.v];
      }
      break;
    case '^':
      {
        if (arg1.t + arg2.t !== 0)
          return [].concat('(', op, arg1.val(), arg2.val(), ')');
        return [Math.pow(arg1.v, arg2.v)];
      }
      break;

    default:
      {
        // case only constat value / variables
        if (arg1 == null && arg2 == null)
          return op;

        // Functions
        let res = ['(', op];
        if (arg1 != null)
          res = res.concat(arg1.val());
        if (arg2 != null)
          res = res.concat(arg2.val());

        return res.concat(')');
      }
  }
}

//------------------------------------------------------------------//
// main logic
//------------------------------------------------------------------//
function parseToken(expressions) {
  return expressions.match(/cos|sin|exp|ln|tan|[0-9]+|x|\+|\^|\-|\*|\/|\)|\(/g)
}

function next(tokens) {
  return tokens.shift();
}

function accept(tokens, char) {
  return tokens[0] == char && tokens.shift();
}

function diffExpression(exp) {
  let op = next(exp);
  let handler = DFunctionsTable[op] || DFunctionsTable['constant'];
  return handler(exp);
}

function expression(tokens) {
  let begin = accept(tokens, '(');

  if (!begin)
    return [next(tokens)];
  let stack = ['(']
  let res = [];
  let a = next(tokens);
  while (true) {
    if (a == ')')
      stack.pop();
    else if (a == '(')
      stack.push('(');

    if (stack.length == 0)
      break;

    res.push(a);
    a = next(tokens);
  }
  return res;
}

function diff(expr) {
  let tokens = parseToken(expr);
  let exp = expression(tokens);

  let diffExp = diffExpression(exp);

  // reduce to res string. respect () rules
  let res = diffExp.reduce((acc, v) => {
    if (v == '(')
      return acc + v;
    else if (v == ')')
      return acc.slice(0, acc.length - 1) + ')' + ' ';
    return acc + v + ' ';
  }, "").trim();

  return res;
}


//------------------------------------------------------------------//
// Test
//------------------------------------------------------------------//

function test(exp) {
  const res = diff(exp);
  console.log(exp, ' -> ', res);
  return res
}

function test2(exp) {
  const res = diff(diff(exp));
  console.log(exp, ' -> ', res);
  return res
}

// Simple expressions
test('x')
test('5')
test("(+ x x)")
test("(- x x)")
test("(* x 2)")
test("(^ x 2)")
test("(/ x 2)")
test("(sin x)")
test("(cos x)")
test("(tan x)") // (+ 1 (^ (tan x) 2))
test("(exp x)")
test("(ln x)")

// Nested expressions
test('(+ x (+ x x))');
test('(- (+ x x) x)');
test('(* 2 (+ x 2))');
test('(/ 2 (+ 1 x))'); // (/ -2 (^ (+ 1 x) 2))
test('(cos (* 2 x))'); // (* 2 (* -1 (sin (* 2 x))))
test('(cos (+ x 1))'); // (* -1 (sin (+ x 1)))
test("(sin (+ x 1))"); //"(cos (+ x 1))"
test("(sin (* 2 x))"); //"(* 2 (cos (* 2 x)))"
test("(tan (* 2 x))"); //"(* 2 (+ 1 (^ (tan (* 2 x)) 2)))"
test("(exp (* 2 x))"); //"(* 2 (exp (* 2 x)))"

// Second derivatives
test2('(sin x)'); // (* -1 (sin x))
test2('(exp x)'); // (exp x)
test2('(^ x 3)'); // (* 3 (* 2 x))
