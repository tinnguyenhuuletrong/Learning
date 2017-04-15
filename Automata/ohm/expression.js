var fs = require('fs');
var ohm = require('ohm-js');
var contents = fs.readFileSync('arithmetic_expressions.ohm');
var myGrammar = ohm.grammar(contents);

var LispSemantic = require("./grammaAsLisp")(myGrammar)
var res = myGrammar.match("(1 + 1 * 3) / abc")

console.log(LispSemantic(res).asLisp)