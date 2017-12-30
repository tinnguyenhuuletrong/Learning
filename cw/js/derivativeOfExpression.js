// http://www.codewars.com/kata/symbolic-differentiation-of-prefix-expressions/train/javascript

const OPERATORS = ['+', '-', '*', '/', '^'];
const FUNCTIONS = ['cos', 'sin', 'exp', 'ln', 'tan'];
const VARIABLES = ['x']

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

  // reduce to res string
  let res = diffExp.reduce((acc, v) => {
    if (['(', ')'].indexOf(v) != -1)
      return acc + v;
    return acc + v + ' ';
  }, "");

  return res;
}


function isNumber(val) {
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

function expressionReduce(exp) {
  if (!Array.isArray(exp))
    return exp;

  const tmp = exp.slice(0);
  const op = tmp.shift();

  // expression
  if (op == '(')
    return exp;

  // constant Or Varialble
  if (OPERATORS.indexOf(op) == -1)
    return op;

  let exp1 = expressionReduce(tmp.shift());
  let exp2 = expressionReduce(tmp.shift());

  let arg1 = isNumber(exp1);
  let arg2 = isNumber(exp2);

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
  }
}


function test(exp) {
  const res = diff(exp);
  console.log(exp, ' -> ', res);
  return res
}

// basic
test('x')
test('5')
test("(+ x x)")
test("(- x x)")
test("(* x 2)")
test("(^ x 2)")
test("(/ x 2)")

// medium
test('(+ x (+ x x))');
test('(- (+ x x) x)');
test('(* 2 (+ x 2))');
test('(/ 2 (+ 1 x))'); // (/ -2 (^ (+ 1 x) 2))

// high
console.log(diff(diff('(^ x 3)'))); // (* 3 (* 2 x))
