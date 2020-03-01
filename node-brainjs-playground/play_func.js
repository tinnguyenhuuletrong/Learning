// Overfit

const fs = require("fs");
const repl = require("repl");
const brain = require("brain.js");
let nNet;

// Function must output [0,1]
const Fx = x => x * 0.5;

// provide optional config object (or undefined). Defaults shown.
const config = {
  hiddenLayers: [1], // array of ints for the sizes of the hidden layers in the network
  activation: "tanh" // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
};

function train() {
  // create a simple feed forward neural network with backpropagation

  const trainData = [];
  for (let i = 0; i < 1000; i++) {
    const x = Math.random();
    const y = Fx(x);
    trainData.push({
      input: [x],
      output: { y: y }
    });
  }

  nNet = new brain.NeuralNetwork(config);
  console.log(
    nNet.train(trainData, {
      errorThresh: 0.003,
      log: true
    })
  );
  global.nNet = nNet;
}

function save() {
  fs.writeFileSync("func_nn.json", JSON.stringify(nNet.toJSON()));
  console.log("saved to func_nn.json");
}

function load(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath).toString());
  console.log(data);
  nNet = new brain.NeuralNetwork(config);
  nNet.fromJSON(data);
  global.nNet = nNet;
  console.log("load done");
}

function check(x) {
  console.log(global.nNet.run([x]));
  console.log("F(x) =", Fx(x));
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
