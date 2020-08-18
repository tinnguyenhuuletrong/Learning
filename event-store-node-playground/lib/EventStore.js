const { promisify } = require("util");
const { EventEmitter } = require("events");
const eventstore = require("eventstore");

const { GlobalConfig } = global;
const isEnable = !!GlobalConfig.MONGODB_ES_URI;

class EventStore extends EventEmitter {
  constructor({ options }) {
    super();
    if (!isEnable) return;

    this.es = eventstore({
      type: "mongodb",
      url: GlobalConfig.MONGODB_ES_URI,
      positionsCollectionName: "positions",
      ...options,
    });
    promisifyEs(this.es);
  }

  async start() {
    return new Promise((resolve, reject) => {
      this.es.init((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async addEvents({ streamId, aggregate, events }) {
    if (!isEnable) return;
    if (!Array.isArray(events)) events = [events];

    return new Promise((resolve, reject) => {
      this.es.getEventStream({ aggregateId: streamId, aggregate }, function (
        err,
        stream
      ) {
        stream.addEvents(events);
        stream.commit(function (err, stream) {
          if (err) reject(err);
          else resolve(stream.eventsToDispatch);
        });
      });
    });
  }

  async queryEvents({ streamId, aggregate, skip = 0, limit = 100 }) {
    if (!isEnable) return;

    return new Promise((resolve, reject) => {
      this.es.getEvents(
        {
          aggregateId: streamId,
          aggregate,
        },
        skip,
        limit,
        function (err, data) {
          if (err) reject(err);
          else resolve(data);
        }
      );
    });
  }

  async getSnapshot({ streamId, aggregate, reducer, shouldSave = true }) {
    if (!isEnable) return;

    if (!(reducer instanceof IReducer)) {
      throw new Error("reducer ins must inherit from IReducer");
    }
    const version = reducer.getVersion();
    const query = {
      aggregateId: streamId,
      aggregate,
      version,
    };

    let [snapshot, stream] = await this.es.getFromSnapshotAsync(query);
    if (snapshot && snapshot.version !== version) {
      this._log("Delete old version", snapshot);
      await this.es.deleteSnapshotAsync(snapshot._id);
      [snapshot, stream] = await this.getFromSnapshotAsync(query);
    }

    var snap = (snapshot && snapshot.data) || {};
    var events = stream.events; // events history from given snapshot

    this._log("LastSnap: \n", snap);
    this._log("NewEvents: \n", events);

    reducer.loadSnapshot(snap);
    reducer.onEvents(events);

    // Saved snapshot object
    const snapShotData = {
      ...snap,
      ...reducer.getSnap(),
      revision: stream.lastRevision,
      updatedAt: new Date(),
      version,
    };

    if (shouldSave && events.length > 0) {
      this._log("Updated snapshot \n", snapShotData);

      await this.es.createSnapshotAsync({
        ...query,
        data: snapShotData,
        revision: stream.lastRevision,
        version,
      });
    }

    return snapShotData;
  }

  _log() {
    // console.log(...arguments);
  }
}

// -------------------------------------------------------//
//  Promisify
// -------------------------------------------------------//

function promisifyEs(es) {
  es.getFromSnapshotAsync = function () {
    return new Promise((resolve, reject) => {
      es.getFromSnapshot(...arguments, (err, snapshotData, stream) => {
        if (err) reject(err);
        else resolve([snapshotData, stream]);
      });
    });
  };

  es.deleteSnapshotAsync = async function (id) {
    return es.store.snapshots.deleteOne({ _id: id });
  };
  es.createSnapshotAsync = promisify(es.createSnapshot).bind(es);
}
// -------------------------------------------------------//

class IReducer {
  loadSnapshot() {
    return {};
  }

  onEvents(events = []) {}

  getSnap() {
    return {};
  }

  getVersion() {
    return 1;
  }
}

module.exports = {
  EventStore,
  IReducer,
};
