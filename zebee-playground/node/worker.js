const ZB = require("zeebe-node");

const zbc = new ZB.ZBClient();

async function main() {
  zbc.createWorker({
    taskType: "fake_data",
    taskHandler: async (job, complete, worker) => {
      console.log("[fake_data] job", job);

      const age = job.variables.age || Math.floor(Math.random() * 30);

      complete.success({
        age,
        userId: String(Date.now()),
      });
    },
  });

  zbc.createWorker({
    taskType: "approve",
    taskHandler: async (job, complete, worker) => {
      console.log("[approve] job", job);

      complete.success({
        approvedToken: Date.now(),
        message: `wellcome ${job.variables.userId}`,
      });
    },
  });

  zbc.createWorker({
    taskType: "reject",
    taskHandler: async (job, complete, worker) => {
      console.log("[reject] job", job);

      complete.success({});
    },
  });
}

main();
