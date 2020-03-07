const chalk = require("chalk");
const { createMutex } = require("../../utils/MemoryMutex");
const Room = require("../Room");

class BullPU {
  constructor(roomId) {
    this.id = roomId;
    this.roomIns = new Room(roomId);
    this._queue = global.BullQueue.createQueue(`room_${roomId}`);

    this._bindMethods();
    this.log("new ins created", process.pid);
  }

  log() {
    console.log(chalk.blue(`[BullPU][${this.id}]`), ...arguments);
  }

  _bindMethods() {
    // Total concurency: 11
    this._queue.process("healthCheck", 10, this.healthCheck);
    this._queue.process("exe", 1, this.exe);
  }

  healthCheck = async job => {
    this.log("healthCheck");
    return {
      status: "success",
      pid: process.pid
    };
  };

  exe = async job => {
    const { batchCmds } = job.data;
    const _mutex = await createMutex(`room_${this.id}`, 100000);
    this.log("exe begin", { id: job.id, batchCmds });
    const res = await this.roomIns.exeCmd(batchCmds);
    this.log("exe end", { db: this.roomIns.db, pid: process.pid });
    _mutex.unlock();
    return res;
  };
}

module.exports = {
  create: roomId => {
    const ins = new BullPU(roomId);
    return ins;
  }
};
