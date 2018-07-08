const { decorate, observable, autorun, action, computed, spy } = require("mobx");

function onChange(change) {
    const { type, name, index, oldValue, newValue, added, removed, object} = change
    console.log({
        object: object.constructor,
        type,
        name,
        index,
        oldValue,
        newValue,
        added,
        removed
    });
}

function basic(params) {
    // box
    console.info('---- Box ----');
    const cityName = observable.box("Vienna");
    console.log(cityName.get());
    // prints 'Vienna'
    cityName.observe(onChange);
    cityName.set("Amsterdam");
    // prints 'Vienna -> Amsterdam'


    // map
    console.info('---- Map ----');
    const map = observable.map({ key: "value" });
    map.observe(onChange);
    map.set("key", "new value");


    // array
    console.info('---- Array ----');
    const list = observable.array([1, 2, 4]);
    list.observe(onChange);
    list[2] = 3;
    list.push(10);
    list.remove(2);


    // smart
    //  https://mobx.js.org/refguide/observable.html
    console.info('---- Smart ----');
    const list1 = observable([1, 2, 3]);
    console.log(list1.constructor)

    const map1 = observable(new Map());
    console.log(map1.constructor)
}

function obj() {
    // object
    console.info('---- Object ----');


    const smartObj = observable.object({
        firstName: "Clive Staples",
        lastName: "Lewis",
        age: 42,

        get labelText() {
            return `${this.firstName} ${this.lastName} - ${this.age}`;
        },

        setAge(age) {
            this.age = age;
        }
    });

    // Hacked way
    // smartObj.$mobx => ObservableObjectAdministration
    smartObj.$mobx.observe(onChange);

    // Official way
    //  -> It track context using fn.call(context) 
    //  -> that is why 1st run with default val :)
    const disposer = autorun((arg) => {
        // arg -> Reaction obj
        console.log(smartObj.labelText)
    });

    smartObj.firstName = "C.S.";
    smartObj.setAge(10);

    // disposer Autorun
    disposer();

    smartObj.firstName = "J.R";
}

function obj2() {
    // object
    console.info('---- Object Decorators----');

    class Person {
        constructor() {
            this.name = "John"
            this.age = 42
            this.showAge = false

            // objects don't need to be converted into observables
            this.ref = null; 
        }
      
        get labelText() {
            console.warn('[compute]', 'labelText')
            const info = this.showAge ? `${this.name} (age: ${this.age})` : this.name;
            return info
        }

        get labelTextWithRef () {
            console.warn('[compute]', 'labelTextWithRef')
            return `${this.labelText} ${this.ref}`
        }

        setAge(age) {
            this.age = age;
        }
    }
    // when using decorate, all fields should be specified (a class might have many more non-observable internal fields after all)
    decorate(Person, {
        name: observable,
        age: observable,
        showAge: observable,
        ref: observable.ref,
        labelText: computed,
        labelTextWithRef: computed,
        setAge: action
    })

    const ins = new Person();

    autorun(_ => console.log(ins.labelTextWithRef))

    ins.ref = 'ref1'
    ins.ref = 'ref2'
    ins.showAge = true;
    ins.setAge(20);
}

function computeVSautorun() {
    console.info('---- Autorun vs Computed ----');
    class NumBag {
        constructor() {
            this.bags = []
        }

        get sum() {
            console.log('[compute] sum calculate')
            return this.bags.reduce((a,b) => a + b, 0);
        }
    }

    decorate(NumBag, {
        bags: observable,
        sum: computed
    })

    const ins = new NumBag();
    var disposer = autorun(() => console.log('sum', ins.sum), {
        delay: 30 // 30 ms debounce
    });

    ins.bags.push(1)
    ins.bags.push(2)

    setTimeout(() => {
        disposer()

        // calulate won't refresh -> no ref
        ins.bags.push(40)

    }, 100);
}

// Spy
// spy((event) => {
//     // console.log(`${event.name} with args: ${event.arguments}`)
//     // console.log(event)
// })

//basic();
//obj();
//obj2();
computeVSautorun()