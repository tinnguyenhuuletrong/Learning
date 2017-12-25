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

  // eval value
  if (dexp1.length == 1 && dexp2.length == 1) {
    return [parseInt(dexp1[0]) + parseInt(dexp2[0])];
  }

  return ['+', dexp1, dexp2];
}

// ( a f (x) - bg(x) ) ' = a f ' (x) - bg' (x)
DFunctionsTable['-'] = function (tokens) {
  const exp1 = expression(tokens);
  const exp2 = expression(tokens);

  const dexp1 = diffExpression(exp1.slice(0));
  const dexp2 = diffExpression(exp2.slice(0));

  // eval value
  if (dexp1.length == 1 && dexp2.length == 1) {
    return [parseInt(dexp1[0]) - parseInt(dexp2[0])];
  }

  return ['-', dexp1, dexp2];
}

// 	( f (x) ∙ g(x) ) ' = f ' (x) g(x) + f (x) g' (x)
DFunctionsTable['*'] = function (tokens) {
  const exp1 = expression(tokens);
  const exp2 = expression(tokens);

  const dexp1 = diffExpression(exp1.slice(0));
  const dexp2 = diffExpression(exp2.slice(0));

  let leftVal = ['(', '*', exp1, dexp2, ')'];
  let rightVal = ['(', '*', dexp1, exp2, ')'];

  // eval value
  // if(eval1.length == 1 && eval2.length == 1) {
  //   return parseInt(eval1[0]) - parseInt(eval2[0]);
  // }

  return ['+', leftVal, rightVal];
}


function parseToken(expressions) {
  return expressions.match(/cos|sin|exp|ln|tan|[0-9]+|x|\+|\-|\*|\/|\)|\(/g)
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

  let res = [];
  let a = next(tokens);
  while (a != ')') {
    res.push(a);
    a = next(tokens);
  }
  return res;
}

function diff(expr) {
  let tokens = parseToken(expr);
  let exp = expression(tokens);
  return diffExpression(exp);
}



function test(exp) {
  const res = diff(exp);
  console.log(res);
}

// test('x')
// test('5')
// test("(+ x x)")
// test("(- x x)")
test("(* x 2)")

