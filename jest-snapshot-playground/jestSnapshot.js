const {
  SnapshotState,
  toMatchSnapshot,
  addSerializer,
} = require("jest-snapshot");
const { isEmpty } = require("lodash");
const { omitDeepLodash } = require("./lodash.ext");

function doCheckSnapshot(actual, testFile, testTitle) {
  // Intilize the SnapshotState, it’s responsible for actually matching
  // actual snapshot with expected one and storing results to `__snapshots__` folder
  const snapshotState = new SnapshotState(testFile, {
    updateSnapshot: process.env.SNAPSHOT_UPDATE ? "all" : "new",
  });

  // Bind the `toMatchSnapshot` to the object with snapshotState and
  // currentTest name, as `toMatchSnapshot` expects it as it’s `this`
  // object members
  const matcher = toMatchSnapshot.bind({
    snapshotState,
    currentTestName: testTitle,
  });

  // Execute the matcher
  const result = matcher(actual);

  // Store the state of snapshot, depending on updateSnapshot value
  snapshotState.save();
  // Return results outside
  return result;
}

class SnapshotHelper {
  constructor(name) {
    this.snapshotPath = "__snapshots__";
    this.name = name;
    this.cpIndex = 0;
  }

  checkpoint(obj, ignoreKey = "") {
    const transformObj = isEmpty(ignoreKey)
      ? obj
      : omitDeepLodash(obj, ignoreKey.split(","));
    const fileName = `${this.snapshotPath}/_${this.cpIndex++}.snapshot`;
    const res = doCheckSnapshot(transformObj, fileName, this.name);
    if (!res.pass) {
      console.log(res.message());
      throw new Error("failed");
    }
  }
}

module.exports = {
  SnapshotHelper,
};
