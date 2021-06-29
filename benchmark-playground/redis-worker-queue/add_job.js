const IORedis = require("ioredis");
const { Worker, isMainThread, workerData } = require("worker_threads");
const { promisify } = require("util");

const waitMs = promisify(setTimeout);

const POOL_SIZE = 5;
const QUEUE_NAME = "orders";
const MAX = 10000;

async function wait_for_queue_clear(con) {
  while (true) {
    await waitMs(10);
    const size = await con.llen(QUEUE_NAME);
    if (size <= 0) return;
  }
}

if (isMainThread) {
  async function main() {
    const begin = console.time("work");

    const con = new IORedis();
    // cleanup
    await con.del(QUEUE_NAME);

    const pools = [];
    for (let i = 0; i < POOL_SIZE; i++) {
      pools.push(
        new Worker(__filename, {
          workerData: { wid: i },
        })
      );
    }

    console.timeLog("work", `filled ${POOL_SIZE * MAX} items`);

    await waitMs(2000);
    await wait_for_queue_clear(con);

    console.timeEnd("work");
  }

  main();
} else {
  const wid = workerData.wid;
  console.log("Start Worker: ", workerData.wid);
  const DONE_LIST = `done:${wid}`;

  async function main(params) {
    const con = new IORedis();

    const jobs = [];

    for (let i = 0; i < MAX; i++) {
      jobs.push(
        con.lpush(
          QUEUE_NAME,
          JSON.stringify({
            id: i,
          })
        )
      );
    }

    await Promise.all(jobs);

    await con.disconnect();
  }

  main();
}
