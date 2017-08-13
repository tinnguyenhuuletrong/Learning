function Interpreter() {
	this.vars = {};
	this.functions = {};
}

Interpreter.prototype.tokenize = function(program) {
	if (program === "")
		return [];

	var regex = /\s*([-+*\/\%=\(\)]|[A-Za-z_][A-Za-z0-9_]*|[0-9]*\.?[0-9]+)\s*/g;
	return program.split(regex).filter(function(s) {
		return !s.match(/^\s*$/);
	});
};

Interpreter.prototype.accept = function(tokens, sym) {
	return tokens[0] && (tokens[0].toLocaleLowerCase() == sym.toLocaleLowerCase()) && tokens.shift()
};

Interpreter.prototype.acceptLowDash = function(tokens) {
	return this.accept(tokens, '_')
};

Interpreter.prototype.operator = function(tokens) {
	return /[-+*\/\%]/.test(tokens[0]) && tokens.shift()
};

Interpreter.prototype.number = function(tokens) {
	return /[0-9]*\.?[0-9]+/.test(tokens[0]) && parseInt(tokens.shift())
};

Interpreter.prototype.letter = function(tokens) {
	return /[A-Za-z]/.test(tokens[0]) && tokens.shift()
};

Interpreter.prototype.identifierChar = function(tokens) {
	let res = null;
	[this.acceptLowDash, this.letter, this.number].some(func => {
		res = func.call(this, tokens)
		return (res != null) && (res != false)
	})
	return res
};

Interpreter.prototype.identifier = function(tokens) {
	let res = null
	res = this.letter(tokens)
	if (!res) return res

	if (this.acceptLowDash(tokens)) {
		res = this.identifierChar(tokens)
	}

	return res
};

Interpreter.prototype.assignment = function(tokens) {
	const id = this.identifier(tokens)
	if (!id)
		return null
	const eq = this.accept(tokens, '=')
	if (!eq)
		return null
	const exp = this.expression(tokens)
	console.log([{
		cmd: 'assign',
		'var': id,
		'val': exp
	}])

	this.vars[id] = exp
	return exp
};

Interpreter.prototype.bracketExpression = function(tokens) {
	const b = this.accept(tokens, '(')
	if (!b) return null;
	const exp = this.expression(tokens)
	if (!exp) return null;
	const e = this.accept(tokens, ')')
	if (!e) return null;
	return exp
};

Interpreter.prototype.mathExpression = function(tokens) {
	const exp1 = this.expression(tokens)
	if (!exp1) return null;

	const op = this.operator(tokens)
	if (!op) return null;

	const exp2 = this.expression(tokens)
	if (!exp2) return null;

	switch (op) {
		case '+':
			return exp1 + exp2

		case '-':
			return exp1 - exp2

		case '*':
			return exp1 * exp2

		case '/':
			return exp1 / exp2

		case '%':
			return exp1 % exp2
	}
};

Interpreter.prototype.factor = function(tokens) {
	let res = null;
	let count = 1;
	[this.number, this.assignment, this.identifier, this.bracketExpression].some(func => {
		res = func.call(this, tokens)
		console.log("factor", count++, res)
		return (res != null) && (res != false)
	})
	return res
};

Interpreter.prototype.expression = function(tokens) {
	let res = null;
	let count = 1;
	[this.factor, this.mathExpression].some(func => {
		res = func.call(this, tokens)
		console.log("exp: ", res, count++)
		return (res != null) && (res != false)
	})
	return res
};

Interpreter.prototype.input = function(expr) {
	var tokens = this.tokenize(expr);
	console.log(tokens)
	const res = this.expression(tokens)
	console.log(" ---> ", res, tokens)
};

//--------------------------------------------------------------------//
// EBNF 
//--------------------------------------------------------------------//
// expression      ::= factor | expression operator expression
// factor          ::= number | identifier | assignment | '(' expression ')'
// assignment      ::= identifier '=' expression

// operator        ::= '+' | '-' | '*' | '/' | '%'

// identifier      ::= letter | '_' { identifier-char }
// identifier-char ::= '_' | letter | digit

// number          ::= { digit } [ '.' digit { digit } ]

// letter          ::= 'a' | 'b' | ... | 'y' | 'z' | 'A' | 'B' | ... | 'Y' | 'Z'
// digit           ::= '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

//----------------------------------------------------//
const interpreter = new Interpreter()
interpreter.input("x = 2")
interpreter.input("1 + 1")