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

Interpreter.prototype.identifier = function(tokens) {
	let res = null
	res = this.letter(tokens)
	if (!res) return res

	if (this.acceptLowDash(tokens)) {
		res = this.identifierChar(tokens)
	}

	return res
};

Interpreter.prototype.assignment = function(tokens, preID) {
	const id = preID || this.identifier(tokens)
	if (!id)
		return null
	const eq = this.accept(tokens, '=')
	if (!eq)
		return null
	const exp = this.expression(tokens)
		// //console.log([{
		// 	cmd: 'assign',
		// 	'var': id,
		// 	'val': exp
		// }])

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

Interpreter.prototype.doOp = function(exp1, op, exp2) {
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

Interpreter.prototype.mathExpression = function(tokens, leftOf) {
	if (tokens.length <= 0) return

	

	let exp1 = leftOf || this.expression(tokens)
	if (!exp1) return null;
	//console.log("mathExpression left", exp1)
	let res = exp1
	let op = null
	while (op = this.operator(tokens)) {
		if (!op) return null;
		//console.log("mathExpression op", op)

		let exp2 = null
		if (['*', '/', '%'].indexOf(op) != -1) {
			//console.log("		mode 1")
			exp2 = this.factor(tokens)
		} else
			exp2 = this.expression(tokens)

		if (!exp2) return null;

		//console.log("mathExpression final", exp1, op, exp2)
		res = this.doOp(exp1, op, exp2)
		exp1 = res 
	}

	return res
};


Interpreter.prototype.identifierChar = function(tokens) {
	let res = null;
	[this.acceptLowDash, this.letter, this.number].some(func => {
		res = func.call(this, tokens)
		return (res != null) && (res !== false)
	})
	return res
};

Interpreter.prototype.identifierOrAssign = function(tokens) {
	const id = this.identifier(tokens)
	const assignTest = this.assignment(tokens, id)

	if (assignTest != null)
		return assignTest
	return id
};


Interpreter.prototype.factor = function(tokens) {
	if (tokens.length <= 0) return

	let res = null;
	let count = 1;
	[this.number, this.identifierOrAssign, this.bracketExpression].some(func => {
		res = func.call(this, tokens)
		//console.log("factor", count++, res)
		return (res != null) && (res !== false)
	})
	return res
};

Interpreter.prototype.expression = function(tokens) {
	if (tokens.length <= 0) return

	let res = this.factor(tokens)

	// Lookup var
	if (res && typeof(res) !== 'number') {
		if (!(res in this.vars))
			throw new Error("variable not found")
		res = this.vars[res]
	}

	//console.log("expression", res)

	let tmpRes = this.mathExpression(tokens, res)
	//console.log("math exp", tmpRes)
	if (tmpRes != null && tmpRes !== false)
		res = tmpRes;
	return res
};

Interpreter.prototype.input = function(expr) {
	var tokens = this.tokenize(expr);
	const res = this.expression(tokens) || ''
	//console.log(tokens, " ---> ", res, tokens)
	return res
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
//--------------------------------------------------------------------//
// EBNF (improve)
//--------------------------------------------------------------------//
// expression 			:= factor | mathExpression
// mathExpression		:= fExpression [ (+-) fExpression ]
// fExpression			:= factor [ (*\/) fExpression ]
// factor          ::= number | identifier | assignment | '(' expression ')'
// assignment      ::= identifier '=' expression

// operator        ::= '+' | '-' | '*' | '/' | '%'

// identifier      ::= letter | '_' { identifier-char }
// identifier-char ::= '_' | letter | digit

// number          ::= { digit } [ '.' digit { digit } ]

// letter          ::= 'a' | 'b' | ... | 'y' | 'z' | 'A' | 'B' | ... | 'Y' | 'Z'
// digit           ::= '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'


const interpreter = new Interpreter()
	// interpreter.input("4 / 2 * 3")
	// interpreter.input('(7 + 3) / (2 * 2 + 1)')
	interpreter.input("x = 2")
	interpreter.input("15 % 10")
	interpreter.input("x = 1")
	interpreter.input("y = x * 100")
	interpreter.input("y % 11")