const path = require("path");
const fs = require("fs");
const vm = require("vm");

// Read script from somewhere
const FLOW_BUNDLE = path.join(__dirname, "../builder/dist/bundle.js");
const script = new vm.Script(fs.readFileSync(FLOW_BUNDLE));

// Instance and run
const scriptIns = {
  // export -> self.
  self: {},

  // Global variable
  console: console,
};
script.runInNewContext(scriptIns);

// Load context from somewhere
let currentContext = {
  activeNode: "START",
  data: {
    age: 1,
  },
};

// Iteration
async function it() {
  const beginContext = { ...currentContext };
  const { state, context } = await scriptIns.self.run(currentContext);
  currentContext = context;

  console.log({
    lastContext: beginContext,
    nextContext: currentContext,
    runningState: state,
  });
}

// Demo run end flow
async function main() {
  await it();
  await it();
  await it();
  await it();
}

main();
