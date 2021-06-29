const { promisify } = require("util");
const IORedis = require("ioredis");
const {
  Worker,
  isMainThread,
  workerData,
  parentPort,
} = require("worker_threads");

const waitMs = promisify(setTimeout);

const POOL_SIZE = 5;
const QUEUE_NAME = "orders";

if (isMainThread) {
  const pools = [];
  for (let i = 0; i < POOL_SIZE; i++) {
    pools.push(
      new Worker(__filename, {
        workerData: { wid: i },
      })
    );
  }

  process.on("SIGINT", async () => {
    console.log("cleanup");
    for (const iterator of pools) {
      iterator.postMessage({ exit: true });
    }
  });
} else {
  const wid = workerData.wid;
  console.log("Start Worker: ", workerData.wid);
  const DONE_LIST = `done:${wid}`;

  async function main() {
    const con = new IORedis();
    await con.del(DONE_LIST);

    let counter = 0;
    parentPort.on("message", (v) => {
      if (v.exit) {
        console.log(`[${wid}] ${counter}`);
        process.exit(0);
      }
    });

    while (true) {
      // Blocking version
      // const itm = await con.brpoplpush(QUEUE_NAME, DONE_LIST, 5);
      // None Blocking version
      const itm = await con.rpoplpush(QUEUE_NAME, DONE_LIST);
      if (itm) {
        counter++;
        console.log(`[${wid}] ${itm}`);
      }
    }
  }

  main();
}
