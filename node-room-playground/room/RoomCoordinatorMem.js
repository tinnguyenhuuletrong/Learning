const Room = require("./Room");
class RoomCoordinatorMem {
  constructor() {
    this.cached = {};
  }

  async exeCmd(roomId, batchCmds) {
    const roomIns = await this.getRoom(roomId);
    const res = await roomIns.exeCmd(batchCmds);
    return res;
  }

  async getRoom(roomId) {
    if (this.cached[roomId]) return this.cached[roomId];
    const insQueue = new Room();
    this.cached[roomId] = insQueue;
    return this.cached[roomId];
  }

  async allRooms() {
    return Object.keys(this.cached);
  }
}
module.exports = RoomCoordinatorMem;
