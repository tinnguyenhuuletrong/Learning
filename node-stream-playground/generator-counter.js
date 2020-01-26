const { promisify } = require("util");
const waitMs = promisify(setTimeout);
const compose = (arrFunc = []) =>
  arrFunc.reduce((acc, func) => func(acc), null);

async function* counterGenerator() {
  let count = 0;
  while (count < 100) {
    count += 1;
    yield count;
  }
}

async function* powerOfTwo(source) {
  for await (const item of source) {
    yield item * item;
  }
}

async function* log(source) {
  for await (const item of source) {
    console.log(item);
  }
}

function waitForMs(val) {
  return async function* wait(source) {
    for await (const item of source) {
      await waitMs(val);
      yield item;
    }
  };
}

const counterIterator = compose([
  counterGenerator,
  waitForMs(100),
  powerOfTwo,
  log
]);

const exe = async iterator => {
  for await (const itm of iterator) {
  }
  console.log("done");
};

exe(counterIterator);
