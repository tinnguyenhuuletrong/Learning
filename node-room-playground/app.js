require("dotenv").config();
const express = require("express");
const BullQueue = require("./libs/BullQueue");
global.BullQueue = BullQueue;

// const RoomCoordinator = require("./room/RoomCoordinatorMem");
const RoomCoordinator = require("./room/RoomCoordinatorBull");
const coordinatorIns = new RoomCoordinator();

const PORT = 3000;
const app = express();
const route = express.Router();

route.get("/", (req, res) => res.send({ ok: 1 }));

route.post("/rooms/:roomId/cmd", async (req, res) => {
  const cmd = req.body;
  const { roomId } = req.params;
  const result = await coordinatorIns.exeCmd(roomId, [cmd]);
  res.send({ status: "success", result });
});
route.get("/rooms", async (req, res) => {
  const result = await coordinatorIns.allRooms();
  res.send({ status: "success", result });
});

app.use(route);
app.listen(PORT, () => {
  console.log(`Listen at port ${PORT}`);
});
