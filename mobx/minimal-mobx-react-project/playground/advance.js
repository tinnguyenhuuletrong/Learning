const { observable, autorun, action, computed, trace, getDependencyTree } = require("mobx");

function createObj() {
    return observable({
        title: "Foo",
        author: {
            name: "Michel"
        },
        likes: [
            "John", "Sara"
        ]
    })
}

function dereference_1() {
    let message = createObj();
    const deco1 = autorun(() => {
        console.log(message.title)
        trace()
    })
    console.log(getDependencyTree(deco1))
    message.title = "Bar"
}

function dereference_2() {
    let message = createObj();
    const title = message.title

    //  message.title was dereferenced outside the autorun
    //  = >title is not an observable so autorun will never react.
    const deco1 = autorun(() => {
        console.log(title)
        trace()
    })

    console.log(getDependencyTree(deco1))
    message.title = "Bar"
}

function dereference_3() {
    let message = createObj();

    const deco1 = autorun(() => {
        console.log(message.author.name)
        trace()
    })

    console.log(getDependencyTree(deco1))
    message.author.name = "Sara";
    message.author = { name: "John" };
}


function correct_log() {
    let message = createObj();

    // WRONG since message is not observable object
    const log1 = autorun(() => {
        console.log('Log1', message)
        trace()
    })
    console.log('Log1:', getDependencyTree(log1))

    // CORRECT It using shallow clone -> read all structure
    const log2 = autorun(() => {
        console.log('Log2', {...message})
        trace()
    })
    console.log('Log2:', getDependencyTree(log2))

    // CORRECT JSON stringify -> read all structure
    const log3 = autorun(() => {
        console.log('Log3:', JSON.stringify(message))
        trace()
    })
    console.log('Log3:', getDependencyTree(log3))

    message.title = "Log Me"
}

correct_log()