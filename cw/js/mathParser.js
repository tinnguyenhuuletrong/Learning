var calc = function (expression) {
  var tokens = expression.match(/\d+\.\d+|\d+|[-+*/\(\)]/g).map(function(t){ return isNaN(t) ? t : Number(t); });
  function accept(sym){ return (tokens[0] == sym) && tokens.shift() }
  function acceptNumber(){ return !isNaN(tokens[0]) && tokens.shift() }
  function acceptAny(arr){ return arr.some( function(a){ return a == tokens[0]} ) && tokens.shift() }
  function doOp(x, op, y){ return [function(a,b){ return a + b;}, function(a,b){ return a - b; }, function(a,b){ return a * b; }, function(a,b){ return a / b; }][("+-*/".indexOf(op))](x,y); }
  function unit(){ return accept('(') ? (e = expr(), accept(')'), e) : acceptNumber(); }
  function unary(){ return accept('-') ? -unit() : unit(); }
  function factor(){ for (var x = unary(); op = acceptAny(['*','/']); x = doOp(x, op, unary())); return x; }
  function expr(){ for (var x = factor(); op = acceptAny(['+','-']); x = doOp(x, op, factor())); return x; }
  return expr();
};