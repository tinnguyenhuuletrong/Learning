const Room = require("./Room");
const bullProcessor = require("./worker/bullPU");

class RoomCoordinatorBull {
  constructor() {}

  async exeCmd(roomId, batchCmds) {
    const roomIns = await this.getRoom(roomId);
    const job = await roomIns.add(
      {
        roomId,
        batchCmds
      },
      { removeOnComplete: true }
    );
    const data = await job.finished();
    return data;
  }

  async getRoom(roomId) {
    const ins = global.BullQueue.createQueue(roomId, {});
    ins.process("*", 1, bullProcessor);
    return ins;
  }

  async allRooms() {
    const allQueue = await global.BullQueue.getQueueList();
    return allQueue;
  }
}
module.exports = RoomCoordinatorBull;
