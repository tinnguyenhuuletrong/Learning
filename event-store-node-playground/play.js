const eventstore = require("eventstore");
const es = eventstore({
  type: "mongodb",
  url: "mongodb://localhost/event-store"
  // eventsCollectionName: "events", // optional
  // snapshotsCollectionName: "snapshots", // optional
  // transactionsCollectionName: "transactions" // optional
  // positionsCollectionName: 'positions' // optioanl, defaultly wont keep position
});

es.on("connect", function() {
  console.log("storage connected");
});

es.on("disconnect", function() {
  console.log("connection to storage is gone");
});

es.init(console.log);

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
      certB: 2.5
    };
  }
  loadSnapshot(snap = {}) {
    this.totalPrice = snap.totalPrice || 0;
  }
  loadFromHistory(history) {
    history.forEach(itm => {
      let val = this.priceMap[itm.payload.type] || 0;
      this.totalPrice += val;
    });
  }
  getSnap() {
    const { totalPrice } = this;
    return {
      totalPrice
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
    history.forEach(itm => {
      this._inc(itm.payload.type);
    });
  }
  getSnap() {
    const { countByType } = this;
    return {
      countByType
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
  es.getEventStream(streamId, function(err, stream) {
    stream.addEvent(createEvent(type));
    stream.commit(function(err, stream) {
      console.log(stream.eventsToDispatch); // this is an array containing all added events in this commit.
    });
  });
}

function updateSnapshot(save = false) {
  const snapshotName = "report_" + streamId;

  es.getFromSnapshot(
    {
      aggregateId: streamId
    },
    function(err, snapshot, stream) {
      var snap = snapshot && snapshot.data;
      var history = stream.events; // events history from given snapshot
      console.log("lastSnap", snap);
      console.log("history", history);

      const priceAggr = new PriceAggerate();
      priceAggr.loadSnapshot(snap && snap.priceAggr);
      priceAggr.loadFromHistory(history);

      const countAggr = new CountAggerate();
      countAggr.loadSnapshot(snap && snap.countAggr);
      countAggr.loadFromHistory(history);

      const snapShotData = {
        priceAggr: priceAggr.getSnap(),
        countAggr: countAggr.getSnap(),
        revision: stream.lastRevision,
        updatedAt: new Date()
      };

      console.log("latest snapshot", snapShotData);

      if (history.length > 0 && save) {
        es.createSnapshot(
          {
            aggregateId: streamId,
            data: snapShotData,
            revision: stream.lastRevision
          },
          function(err) {
            console.log("snapshot updated:", snapshotName);
          }
        );
      }
    }
  );
}
