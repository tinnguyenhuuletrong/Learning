class Thing {
	constructor(name) {
		this.name = name
		this.boolProps = {}
		this.dynamicProps = {}
		this.dynamicArrays = {}
		this._booleanProps()
		this._customProps()
		return new Proxy(this, this);
	}

	_booleanProps() {
		this.is_a = new Proxy({}, {
			get: (target, name) => {
				if (this.boolProps[name] == null)
					this.boolProps[name] = true
				return this.boolProps[name]
			}
		})

		this.is_not_a = new Proxy({}, {
			get: (target, name) => {
				if (this.boolProps[name] == null)
					this.boolProps[name] = false
				return this.boolProps[name]
			}
		})
	}

	_customProps() {
		this.is_the = new Proxy({}, {
			get: (target, key) => {
				return new Proxy({}, {
					get: (target, val) => {
						this.dynamicProps[key] = val
					}
				})
			}
		})
	}

	has(num) {
		return new Proxy({}, {
			get: (target, key) => {
				if (key in this.dynamicArrays)
					return this.dynamicArrays[key]
				else
					this.dynamicArrays[key] = (new Array(num)).fill(1).map(itm => new Thing())
				return this.dynamicArrays[key]
			}
		})
	}

	get(target, prop) {
		if (prop in target)
			return this[prop]
		else if (prop.startsWith && prop.startsWith("is_a_"))
			return this.boolProps[prop.split('is_a_')[1]] || false;
		else if (prop in this.dynamicProps)
			return this.dynamicProps[prop]
		else if (prop in this.dynamicArrays) {
			if (this.dynamicArrays[prop].length == 1)
				return this.dynamicArrays[prop][0]
			return this.dynamicArrays[prop]
		}

	}
}

//--------------------------------------------------------//
const jane = new Thing('Jane')
console.log(jane.name) // => 'Jane'


// can define boolean methods on an instance
jane.is_a.person
jane.is_a.woman
jane.is_not_a.man

console.log(jane.is_a_person)
console.log(jane.is_a_man)

// can define properties on a per instance level
jane.is_the.parent_of.joe
console.log(jane.parent_of) // => 'joe'


// can define number of child things
// when more than 1, an array is created
jane.has(2).legs
console.log(jane.legs.length) // => 2
console.log(jane.legs[0] instanceof Thing) // => true


// can define single items
jane.has(1).head
console.log(jane.head instanceof Thing) // => true

// can define number of things in a chainable and natural format
jane.has(2).arms.each(arm => having(1).hand.having(5).fingers )
jane.arms[0].hand.fingers.length // => 5
