const { promisify } = require("util");

const sleepMs = promisify(setTimeout);
const Room = require("../Room");

module.exports = async function(job) {
  console.log("job begin", job.data);
  const { roomId, batchCmds } = job.data;
  const ins = new Room();
  const res = await ins.exeCmd(batchCmds);

  await sleepMs(10000);
  console.log("job end", res);
  return Promise.resolve(res);
};
