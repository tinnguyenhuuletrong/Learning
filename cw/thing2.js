const STATE = {
	WAITING: 1,
	BOOL: 2,
	CUSTOM_KEY: 3,
	CUSTOM_VAL: 4
}

const KEY_VAL_STOPER = ["is_the"]

class Thing {
	constructor(name) {
		this.name = name

		this._state = STATE.WAITING
		this._tmp = true

		const _proxy = new Proxy(this, {
			has: _ => true,
			get: (object, property) => this._dynamicGet(_proxy, object, property)
		})

		return _proxy
	}

	_dynamicGet(proxy, object, property) {
		if (Reflect.has(object, property))
			return Reflect.get(object, property);

		if (typeof property == 'symbol')
			return object;

		console.log(this.name, this._state, property)

		switch (this._state) {
			case STATE.WAITING:
				{
					if (property.startsWith("is_a_")) {
						const queryKey = property.split("is_a_")[1]
						if (queryKey)
							return this[queryKey] || false
					} else if (property.startsWith("is_a")) {
						this._tmp = true
						this._state = STATE.BOOL
					} else if (property.startsWith("is_not_a")) {
						this._tmp = false
						this._state = STATE.BOOL
					} else if (KEY_VAL_STOPER.some(itm => property.startsWith(itm))) {
						this._state = STATE.CUSTOM_KEY
					}
					break;
				}
			case STATE.BOOL:
				{
					this[property] = this._tmp
					this._state = STATE.WAITING
					break;
				}
			case STATE.CUSTOM_KEY:
				{
					this._tmp = property
					this._state = STATE.CUSTOM_VAL
					break;
				}
			case STATE.CUSTOM_VAL:
				{
					this[this._tmp] = property
					this._state = STATE.WAITING
				}
		}



		return proxy
	}
}

//--------------------------------------------------------//
const jane = new Thing('Jane')
console.log(jane.name) // => 'Jane'


// // can define boolean methods on an instance
// jane.is_a.person
// jane.is_a.woman
// jane.is_not_a.man

// console.log(jane.is_a_person)
// console.log(jane.is_a_man)

jane.is_the.parent_of.joe
console.log(jane.parent_of)