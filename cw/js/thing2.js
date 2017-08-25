const KEY_VAL_STOPER = ["is_the", "being_the", "and_the", "with_the"]
const FUNCTION_STOPER = ["having", "has", "with"]
const ABILITIES_STOPER = ["can"]

function convertSingular(name) {
	let res = name.match(/([A-z]+)(s|es)$/)
	if(!res)
		return name
	return res[1]
}

class ThingArray extends Array {
	constructor(name, num) {
		super();
		for (var i = 0; i < num; i++) {
			this.push(new Thing(name))
		}
		return new Proxy(this, {
			get: (object, property) => {
				if (Reflect.has(object, property)) {
					return Reflect.get(object, property)
				} else {
					return Reflect.get(this[0], property)
				}
			}
		})
	}

	each(func) {
		const dummy = new Function('context', `with(context){${func.toString().split('=>')[1]}}`)
		this.forEach(itm => {
			dummy(itm)
		})
	}

}

class Thing {
	constructor(name) {
		this.name = name

		const _proxy = new Proxy(this, {
			has: _ => true,
			get: (object, property) => this._dynamicGet(_proxy, object, property)
		})

		return _proxy
	}

	_dynamicGet(proxy, object, property) {
		if (Reflect.has(object, property)) {
			const tmp = Reflect.get(object, property)
			if ((tmp instanceof ThingArray) && tmp.length == 1) {
				return tmp[0]
			}
			return tmp;
		}

		if (typeof property == 'symbol')
			return object;

		// console.log(this.name, this._state, property)

		if (property.startsWith("is_a_")) {
			const queryKey = property.split("is_a_")[1]
			if (queryKey)
				return this[queryKey] || false
		} else if (property.startsWith("is_a")) {
			return new Proxy({}, {
				get: (obj, boolKey) => {
					this[boolKey] = true
					return proxy
				}
			})
		} else if (property.startsWith("is_not_a")) {
			return new Proxy({}, {
				get: (obj, boolKey) => {
					this[boolKey] = false
					return proxy
				}
			})
		} else if (KEY_VAL_STOPER.some(itm => property.startsWith(itm))) {
			return new Proxy({}, {
				get: (obj, key) => {
					return new Proxy({}, {
						get: (obj, val) => {
							this[key] = val
							return proxy
						}
					})
				}
			})
		} else if (FUNCTION_STOPER.some(itm => property.startsWith(itm))) {
			const self = this
			return function(num) {
				return new Proxy({}, {
					get: (obj, val) => {
						if (self[val] == null)
							self[val] = new ThingArray(convertSingular(val), num)
						return self[val]
					}
				})
			}
		} else if (ABILITIES_STOPER.some(itm => property.startsWith(itm))) {
			const self = this
			return new Proxy({}, {
				get: (obj, methodName) => {
					return function(catalog, exeFunc) {
						// incase no catalog specs
						if(catalog instanceof Function) {
							exeFunc = catalog
							catalog = "none"
						}

						self[catalog] = []
						
						const args = ['context'].concat(exeFunc.toString().split('=>')[0])
						const tmp = new Function(args.join(','), `
							with(context){
								let res = ${exeFunc.toString().split('=>')[1]}
								return res
							}
						`)
						self[methodName] = function() {
							let tmpArgs = [self, ...arguments]
							const res = tmp.call(self, ...tmpArgs)
							self[catalog].push(res)
							return res
						}
					}
				}
			})
		}

		return proxy
	}
}

//--------------------------------------------------------//
const jane = new Thing('Jane')
console.log(jane.name) // => 'Jane'


// // can define boolean methods on an instance
jane.is_a.person
jane.is_a.woman
jane.is_not_a.man

console.log(jane.is_a_person)
console.log(jane.is_a_man)

jane.is_the.parent_of.joe
console.log(jane.parent_of)

// can define number of child things
// when more than 1, an array is created
jane.has(2).legs
console.log(jane.legs.length) // => 2
console.log(jane.legs[0] instanceof Thing) // => true

// can define single items
jane.has(1).head
console.log(jane.head instanceof Thing) // => true

jane.has(2).arms.each(arm => having(1).hand.having(5).fingers)
console.log(jane.arms[0].hand.fingers.length)

// can define properties on nested items
jane.has(1).head.having(2).eyes.each(eye => being_the.color.blue.with(1).pupil.being_the.color.black)

// can define methods
jane.can.speak(phrase =>
	`${name} says: ${phrase}`)

console.log(jane.speak("hello")) // => "Jane says: hello"

// if past tense was provided then method calls are tracked
console.log(jane.spoke) // => ["Jane says: hello"]