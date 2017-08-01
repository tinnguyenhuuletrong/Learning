class BigNumber {

	constructor(number) {
		this.data = this._stadalize(number)
	}

	_stadalize(number) {
		this.sign = 1;

		// sign process
		if(number[0] == '-'){
			this.sign = -1;
			number = number.slice(1, number.length)
		}
		else if(number[0] == '+') {
			number = number.slice(1, number.length)
		}

		// remove 0 from left
		number = number.replace(/^0+/,"");
		this.dotIndex = number.indexOf('.')

		// remove 0 right
		if(this.dotIndex != -1){
			number = number.replace(/0+$/, '');
			number = number.replace(/\.+$/, '', '');
		}

		if(number[0] == '.')
			number = '0' + number

		if(number.length == 0)
			number = '0';

		this.dotIndex = number.indexOf('.')

		return number
	}

	wipeDecimal() {
		let numberShiff = new BigNumber('0')
		if(this.dotIndex >=0){
			numberShiff = new BigNumber('1' + '0'.repeat(this.data.length - 1 - this.dotIndex))
		}
		return {
			num: new BigNumber(this.data.replace('.', '')),
			shiff: numberShiff
		}
	}

	shiffLeft(num) {
		if(num == 0) return new BigNumber(this.data)
		let data = this.data
		let index = data.length - num

		if(data.length - num<0){
			data = BigNumber.padLength(this, num)
			index = data.length - num
		}

		return new BigNumber(data.slice(0, index) + "." + data.slice(index))
	}

	shiffRight(num) {
		return new BigNumber(this.data + '0'.repeat(num))
	}

	toString() {
		if(this.data == '0')
			return this.data

		if(this.sign > 0)
			return this.data
		else
			return '-' + this.data
	}

	static padLength(num, length) {
		const zeroPad = Math.max(length - num.data.length , 0)
		return '0'.repeat(zeroPad) + num.data
	}

	static sum(num1, num2) {
		const length = Math.max(num1.data.length, num2.data.length)
		let A = BigNumber.padLength(num1, length)
		let B = BigNumber.padLength(num2, length)

		let C = ''
		let carry = 0
		for (var i = A.length - 1; i >= 0; i--) {
			let tmp = +A[i] + +B[i] + carry
			carry = Math.floor(tmp / 10)
			C = (tmp%10) + C
		}
		return new BigNumber(carry + C);
	}

	static mul(num1, num2) {
		let norA = num1.wipeDecimal()
		let norB = num2.wipeDecimal()

		let decShift = Math.max(norA.shiff.data.length + norB.shiff.data.length - 2, 0)
		// console.log(num1, num2, norA, norB)

		const length = Math.max(norA.num.data.length, norA.num.data.length)
		let A = BigNumber.padLength(norA.num, length)
		let B = BigNumber.padLength(norB.num, length)

		// console.log(A,B)
		let res = new BigNumber('0')
		for (var i = B.length - 1; i >= 0; i--) {
			let mulRound = ''
			let carry = 0
			for (var j = A.length - 1; j >= 0; j--) {
				const tmp = +B[i] * +A[j] + carry
				carry = Math.floor(tmp / 10)
				mulRound = (tmp%10) + mulRound
			}
			mulRound = (new BigNumber(carry + mulRound)).shiffRight(B.length - 1 - i)
			res = BigNumber.sum(res, mulRound)
		}

		res = res.shiffLeft(decShift)
		res.sign = num1.sign * num2.sign
		return res
	}
}


const a = new BigNumber("0.0908")
const b = new BigNumber("0.01")

// console.log(BigNumber.sum(a,b))
console.log(BigNumber.mul(a,b).toString())

