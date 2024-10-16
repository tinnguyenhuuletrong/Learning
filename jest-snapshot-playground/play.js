const assert = require("assert");
const { SnapshotHelper } = require("./jestSnapshot");

for (let i = 0; i < process.argv.length; i++) {
  const element = process.argv[i];
  if (element === "--updateSnapshot") {
    console.info("[Env] update snapshot mode");
    process.env.SNAPSHOT_UPDATE = 1;
  }
}

async function main() {
  const testTitle = "scenario_1";
  const checker = new SnapshotHelper(testTitle);
  const db = {
    user: {},
  };
  checker.checkpoint(db);

  db.user["1"] = {
    name: "ttin",
    _created: new Date(),
    items: [
      { id: 22, _created: new Date() },
      { id: 21, _created: new Date() },
    ],
  };
  checker.checkpoint(db, "_created");
}

main();
