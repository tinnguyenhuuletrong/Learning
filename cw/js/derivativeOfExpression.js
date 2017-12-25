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
  return diffExpression(exp).join(' ');
}


function isNumber(val) {
  try {
    if (VARIABLES.indexOf(val) != -1) return null;
    if (Array.isArray(val)) return null;

    return parseInt(val);
  } catch (error) {
    return null;
  }
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

  if (op === '*' && (arg1 === 0 || arg2 === 0))
    return [0];

  if (arg1 == null || arg2 == null)
    return [].concat('(', op, exp1, exp2, ')');

    switch (op) {
      case '+':
        {
          return [arg1 + arg2];
        }
        break;
      case '-':
        {
          return [arg1 - arg2];
        }
        break;
      case '*':
        {
          return [arg1 * arg2];
        }
        break;
      case '/':
        {
          return [arg1 / arg2];
        }
        break;
      case '^':
        {
          return [Math.pow(arg1, arg2)];
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
console.log((diff('( * 3 ( ^ x 2 ) )')));
