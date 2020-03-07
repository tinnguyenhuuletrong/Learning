const BullQueue = require("./libs/BullQueue");
global.BullQueue = BullQueue;
const RoomCoordinator = require("./room/RoomCoordinatorBull");
const coordinatorIns = new RoomCoordinator({ workerHost: true });
