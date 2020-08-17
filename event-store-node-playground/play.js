const { promisify } = require("util");
const eventstore = require("eventstore");
const es = eventstore({
  type: "mongodb",
  url: "mongodb://localhost/event-store",
  maxSnapshotsCount: 1,
  eventsCollectionName: "new_events", // optional
  snapshotsCollectionName: "new_snapshots", // optional
  // transactionsCollectionName: "transactions" // optional
  // positionsCollectionName: 'positions' // optioanl, defaultly wont keep position
});

// -------------------------------------------------------//
//  Promisify
// -------------------------------------------------------//
es.getFromSnapshotAsync = function () {
  return new Promise((resolve, reject) => {
    es.getFromSnapshot(...arguments, (err, snapshotData, stream) => {
      if (err) reject(err);
      else resolve([snapshotData, stream]);
    });
  });
};

es.deleteSnapshotAsync = async function (id) {
  return await es.store.snapshots.remove({ _id: id });
};
es.createSnapshotAsync = promisify(es.createSnapshot).bind(es);
// -------------------------------------------------------//

es.on("connect", function () {
  console.log("storage connected");
});

es.on("disconnect", function () {
  console.log("connection to storage is gone");
});

es.init(() => {
  printHelp();
});

const streamId = "client_id_1";

function createEvent(type) {
  return { type };
}

//---------------
// Aggerator
//---------------
class PriceAggerate {
  constructor() {
    this.totalPrice;
    this.priceMap = {
      certA: 10,
      certB: 2.5,
    };
  }
  loadSnapshot(snap = {}) {
    this.totalPrice = snap.totalPrice || 0;
  }
  loadFromHistory(history) {
    history.forEach((itm) => {
      let val = this.priceMap[itm.payload.type] || 0;
      this.totalPrice += val;
    });
  }
  getSnap() {
    const { totalPrice } = this;
    return {
      totalPrice,
    };
  }
}

class CountAggerate {
  constructor() {
    this.countByType = {};
  }
  loadSnapshot(snap = {}) {
    this.countByType = snap.countByType || {};
  }
  loadFromHistory(history) {
    history.forEach((itm) => {
      this._inc(itm.payload.type);
    });
  }
  getSnap() {
    const { countByType } = this;
    return {
      countByType,
    };
  }

  _inc(type, num = 1) {
    let oldVal = this.countByType[type] || 0;
    this.countByType[type] = oldVal + num;
  }
}

//---------------
// Utils
//---------------
function addEvent(type) {
  es.getEventStream(streamId, function (err, stream) {
    stream.addEvent(createEvent(type));
    stream.commit(function (err, stream) {
      console.log(stream.eventsToDispatch); // this is an array containing all added events in this commit.
    });
  });
}

async function updateSnapshot(save = false, version = 1) {
  const snapshotName = "report_" + streamId;

  const query = {
    aggregateId: streamId,
    version,
  };

  let [snapshot, stream] = await es.getFromSnapshotAsync(query);
  if (snapshot && snapshot.version !== version) {
    console.log("delete", snapshot);
    await es.deleteSnapshotAsync(snapshot._id);
    [snapshot, stream] = await es.getFromSnapshotAsync(query);
  }

  var snap = (snapshot && snapshot.data) || {};
  var history = stream.events; // events history from given snapshot

  console.log("LastSnap: \n", snap);
  console.log("NewEvents: \n", history);

  // Init value for Aggerate
  const priceAggr = new PriceAggerate();
  priceAggr.loadSnapshot(snap && snap.priceAggr);
  priceAggr.loadFromHistory(history);

  const countAggr = new CountAggerate();
  countAggr.loadSnapshot(snap && snap.countAggr);
  countAggr.loadFromHistory(history);

  // Saved snapshot object
  const snapShotData = {
    priceAggr: priceAggr.getSnap(),
    countAggr: countAggr.getSnap(),
    revision: stream.lastRevision,
    updatedAt: new Date(),
  };

  console.log("Updated snapshot \n", snapShotData);

  if (history.length > 0 && save) {
    await es.createSnapshotAsync({
      aggregateId: streamId,
      data: snapShotData,
      revision: stream.lastRevision,
      version,
    });
  }

  return snapShotData;
}

function printHelp() {
  console.log("supported:");
  console.log('-  addEvent("certA"|"certB"|"...")');
  console.log("-  updateSnapshot(true)");
}
