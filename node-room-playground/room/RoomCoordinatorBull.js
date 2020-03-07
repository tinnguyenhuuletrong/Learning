const chalk = require("chalk");
const { promisify } = require("util");
const sleepMs = promisify(setTimeout);

const Room = require("./Room");
const bullPU = require("./worker/bullPU");

class RoomCoordinatorBull {
  constructor(
    options = {
      workerHost: true
    }
  ) {
    this._options = options;
    this._init();
    this.puQueueCache = [];
  }

  log() {
    console.log(chalk.blue("[RoomCoordinatorBull]"), ...arguments);
  }

  //-------------------------------------------------------------------//
  //  Private
  //-------------------------------------------------------------------//

  async _init() {
    this.coordinatorQueue = global.BullQueue.createQueue("spawner");
    if (this._options.workerHost) {
      this.coordinatorQueue.process("spawn", this._spawnPU);
    }
  }

  _spawnPU = async job => {
    const { roomId } = job.data;
    this.log("Create new PU", roomId);
    await bullPU.create(roomId);
    this.log("Create new PU success", roomId);
    return Promise.resolve(true);
  };

  async _waitingForJob(job, { timeoutMs, attempts = 1 }) {
    let total = attempts;
    const sleep = timeoutMs / attempts;
    let state;
    while (total-- > 0) {
      state = await job.getState();
      if (state !== "waiting") break;
      await sleepMs(sleep);
    }

    // not yet processing
    if (state === "waiting") {
      job.remove();
      throw new Error("timeout");
    }

    const res = await job.finished();
    job.remove();
    return res;
  }

  async isAlive(ins) {
    try {
      /** @type {import('bull').Queue} */
      const queue = ins;
      const alliveCheckJob = await queue.add("healthCheck", {});
      const healthCheckData = await this._waitingForJob(alliveCheckJob, {
        timeoutMs: 50,
        attempts: 5
      });
      return {
        status: true,
        healthCheckData
      };
    } catch (error) {
      return {
        status: false
      };
    }
  }

  async _getOrCreatePUQueue(roomId) {
    /** @type {import('bull').Queue} */
    let ins = this.puQueueCache[roomId];
    if (!ins) {
      ins = global.BullQueue.createQueue(`room_${roomId}`);
      this.puQueueCache[roomId] = ins;
    }

    const { status, healthCheckData } = await this.isAlive(ins);

    // Todo: Should have mutex lock here
    //  -> prevent multiple spawn cmd

    // Spawn new one
    if (!status) {
      const createPuJob = await this.coordinatorQueue.add("spawn", { roomId });
      await createPuJob.finished();
      createPuJob.remove();
    }

    return [ins, healthCheckData];
  }

  //-------------------------------------------------------------------//
  //  Public
  //-------------------------------------------------------------------//

  async exeCmd(roomId, batchCmds) {
    const [roomIns, healthCheckData] = await this._getOrCreatePUQueue(roomId);
    const job = await roomIns.add("exe", {
      roomId,
      batchCmds
    });
    this.log(healthCheckData);
    const data = await job.finished();
    job.remove();
    return data;
  }

  async allRooms() {
    const allQueue = await global.BullQueue.getQueueList();
    return allQueue;
  }
}
module.exports = RoomCoordinatorBull;
