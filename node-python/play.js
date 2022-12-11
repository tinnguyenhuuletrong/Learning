const { Worker } = require("worker_threads");
const path = require("path");
const nodecallspython = require("node-calls-python");
const py = nodecallspython.interpreter;

async function runInWorker(pyfile, inp) {
  const src = `
    const {
      parentPort,
      workerData
    } = require('worker_threads');
    const nodecallspython = require("node-calls-python");
    const py = nodecallspython.interpreter;
    let pyfile = '${pyfile}'
    const pymodule = py.importSync(pyfile);
    const logreg =  py.createSync(pymodule, "LogReg", "iris");
    const predict =  py.callSync(logreg, "predict", workerData); // call predict
    parentPort.postMessage(predict)
  `;

  const worker = new Worker(src, {
    eval: true,
    workerData: inp,
    stdout: "inherit",
  });
  return new Promise((resolve, reject) => {
    worker.on("message", (msg) => {
      resolve(msg);
    });
    worker.on("error", (err) => {
      reject(err);
    });
  });
}

async function main() {
  try {
    let pyfile = path.join(__dirname, "pymodule.py");
    console.log(pyfile);
    const pymodule = await py.import(pyfile);
    console.log(pymodule);
    const result = await py.call(
      pymodule,
      "multiple",
      [1, 2, 3, 4],
      [2, 3, 4, 5]
    );
    console.log("np.multiple", [1, 2, 3, 4], [2, 3, 4, 5], "->", result);

    // create the instance of the classifier
    // const logreg = await py.create(pymodule, "LogReg", "iris");
    // const predict = await py.call(logreg, "predict", [[1.4, 5.5, 1.2, 4.4]]); // call predict
    // console.log(predict);

    const res = await runInWorker(pyfile, [[1.4, 5.5, 1.2, 4.4]]);
    console.log(res);
  } catch (error) {
    console.error(error);
  }
}
main();
