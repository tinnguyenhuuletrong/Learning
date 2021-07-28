const fs = require("fs");
const { spawn } = require("child_process");
const proc = spawn("../runner-env/bin/python", ["input_pipe.py"]);
const VIDEO_PATH = "/Users/admin/Downloads/money.mp4";

console.log(`Spawned child pid: ${proc.pid}`);
fs.createReadStream(VIDEO_PATH).pipe(proc.stdin);

proc.stdout.on("data", (data) => {
  console.log(`Received chunk ${data}`);
});
