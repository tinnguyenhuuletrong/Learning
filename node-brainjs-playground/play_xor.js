const fs = require("fs");
const repl = require("repl");
const brain = require("brain.js");
let nNet;

// provide optional config object (or undefined). Defaults shown.
const config = {
  binaryThresh: 0.5,
  hiddenLayers: [3], // array of ints for the sizes of the hidden layers in the network
  activation: "sigmoid" // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
};

function train() {
  // create a simple feed forward neural network with backpropagation
  nNet = new brain.NeuralNetwork(config);
  nNet.train(
    [
      { input: [0, 0], output: [0] },
      { input: [0, 1], output: [1] },
      { input: [1, 0], output: [1] },
      { input: [1, 1], output: [0] }
    ],
    {
      errorThresh: 0.001,
      log: true
    }
  );
  global.nNet = nNet;
}

function save() {
  fs.writeFileSync("xor_nn.json", JSON.stringify(nNet.toJSON()));
  console.log("saved to xor_nn.json");
}

function load(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath).toString());
  console.log(data);
  nNet = new brain.NeuralNetwork(config);
  nNet.fromJSON(data);
  global.nNet = nNet;
  console.log("load done");
}

function check(x, y) {
  console.log(global.nNet.run([x, y]));
}

global.save = save;
global.train = train;
global.load = load;
global.check = check;

repl.start({
  useGlobal: true
});

console.log("=========================================== \n\n");

console.log("save");
console.log("train");
console.log("load");
console.log("check");
