//https://en.wikipedia.org/wiki/Shunting-yard_algorithm
const TOKEN_CHAR = {
	'!': 3.1, // right associative
	'-': 2,
	'+': 2,
	'*': 3,
	'/': 3,
	'(': 1,
	')': 1,
}

function isNumberChar(char) {
	return char >= '0' && char <= '9'
}

function nextToken(context) {
	while (context.data[context.index] == ' ') {
		context.index++;
		continue
	}

	let char = context.data[context.index]
	if (TOKEN_CHAR[char]) {
		let nextChar = context.data[context.index + 1]
		let preChar = context.data[context.index - 1]
		if (char == '-' && isNumberChar(nextChar)) {

		} else if (char == '-' && nextChar == '(' && preChar != ')') {
			// unary minus as right associative
			char = '!'
			context.index++;
			return {
				token: char,
				score: TOKEN_CHAR[char],
				type: 'token'
			}

		} else {
			context.index++;
			return {
				token: char,
				score: TOKEN_CHAR[char],
				type: 'token'
			}
		}
	}

	// Number 
	let sign = 1;
	if (context.data[context.index] == '-') {
		context.index++;
		sign = -1;
	}
	let data = ''

	char = context.data[context.index++]
	do {
		data += char
		char = context.data[context.index++]
	}
	while (isNumberChar(char) || char == '.')

	context.index--;
	return {
		token: +data * sign,
		type: 'number'
	}
}

function toPolishNotion(tokens) {
	let byteCode = []
	let stack = []
	for (var i = 0; i < tokens.length; i++) {
		let token = tokens[i]

		// number -> push to output
		if (token.type == 'number') {
			byteCode.push(token.token)
			continue
		}

		// not bracket
		if (token.score > 1) {
			// while stack[top] > token score
			// 	pop AND push to output
			while (stack.length > 0) {
				let top = stack[stack.length - 1]
				if (TOKEN_CHAR[top] >= token.score && TOKEN_CHAR[top] < 4) {
					stack.pop()
					byteCode.push(top)
				} else
					break
			}

			// push token to stack
			stack.push(token.token)
		}

		// open bracket -> push to stack
		if (token.token == '(') {
			stack.push(token.token)
		} else if (token.token == ')') {
			// close bracket -> pop AND push to output UNTIL meet open bracket
			while (stack.length > 0) {
				let top = stack[stack.length - 1]
				if (top != '(') {
					stack.pop()
					byteCode.push(top)
				} else
					break
			}
			stack.pop()
		}
	}

	// push remaining token to output
	while (stack.length > 0) {
		let top = stack.pop()
		byteCode.push(top)
	}
	return byteCode
}

function exeByteCode(byteCode) {
	const stack = []

	for (var i = 0; i < byteCode.length; i++) {
		const token = byteCode[i]
		if (token == '+') {
			const a = stack.pop()
			const b = stack.pop()
			stack.push(a + b)
		} else if (token == '-') {
			const a = stack.pop()
			const b = stack.pop()
			stack.push(b - a)
		} else if (token == '*') {
			const a = stack.pop()
			const b = stack.pop()
			stack.push(a * b)
		} else if (token == '/') {
			const a = stack.pop()
			const b = stack.pop()
			stack.push(b / a)
		} else if (token == '!') {
			const a = stack.pop()
			stack.push(-a)
		} else
			stack.push(token)

		//console.log(token, stack)
	}

	return stack
}

function expand(tokens) {
	let res = []
	for (var i = 0; i < tokens.length; i++) {
		let a = tokens[i]
		let b = tokens[i + 1] || {}
		let c = tokens[i + 2] || {}

		// a -b => a + -b
		if (a.type == 'number' && b.type == 'number') {
			if (b.token < 0) {
				res.push(...[a, {
					token: '+',
					score: TOKEN_CHAR['+'],
					type: 'token'
				}])
		 	}
		 	continue
		} 
		
		res.push(a)
	}
	return res
}

function evaluateMath(str) {
	const context = {
		data: str,
		index: 0
	}

	// parse Token
	let tokens = []
	while (context.index < str.length) {
		tokens.push(nextToken(context))
	}
	tokens = expand(tokens)
	//console.log(tokens)

	let byteCode = toPolishNotion(tokens)
	//console.log(byteCode)

	let res = exeByteCode(byteCode)
	return res[0]

}

var calc = function(expression) {
	expression = expression.trim()

	// convert (number) => number
	expression = expression.replace(/\(([0-9]+)\)/g, (a,b) => b)
	return evaluateMath(expression)
};



// console.log(calc("(1 - 2) - -(-(-4))"))
// console.log(calc("12* 123/-(-5 + 2)"))
// console.log(calc("123.45*(678.90 / (-2.5+ 11.5)-(80 -19) *33.25) / 20 + 11"))
// const test = "(123.45*(678.90 / (-2.5+ 11.5)-(((80 -(19))) *33.25)) / 20) - (123.45*(678.90 / (-2.5+ 11.5)-(((80 -(19))) *33.25)) / 20) + (13 - 2)/ -(-11) "
// console.log(calc(test))

