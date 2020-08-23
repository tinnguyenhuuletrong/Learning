const { MongoClient } = require("mongodb");

// --------------------------------------------//

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

class SnapshotStore {
  constructor(name, eventStore, { mongodbClient }) {
    this.eventStore = es;
    /** @type {MongoClient} */
    this.mongodbClient = mongodbClient;
    this.name = name;
  }

  async _getFromSnapshotAsync({ aggregateId, aggregate, context }) {
    let revMin = 0;
    let revMax = -1;
    let lastPosition = 0;
    const { mongodbClient, name } = this;
    const lastSnapshotIns = await mongodbClient
      .db()
      .collection(name)
      .findOne({ aggregateId, aggregate, context });

    if (lastSnapshotIns && lastSnapshotIns.position) {
      revMin = lastSnapshotIns.position + 1;
      lastPosition = lastSnapshotIns.position;
    }

    const events = await this.eventStore.getEventPositions({
      streamId: aggregateId,
      aggregate,
      context,
      revMin,
      revMax,
    });

    if (events && events.length > 0) {
      lastPosition = events[events.length - 1].position;
    }

    return [lastSnapshotIns, { events, lastPosition }];
  }

  async _deleteSnapshotAsync(id) {
    const { mongodbClient, name } = this;
    await mongodbClient.db().collection(name).deleteOne({ _id: id });
  }

  async _createSnapshotAsync(lastIns, data) {
    const { mongodbClient, name } = this;
    const newData = {
      ...data,
      commitStamp: new Date(),
    };
    if (!lastIns) await mongodbClient.db().collection(name).insertOne(newData);
    else
      await mongodbClient
        .db()
        .collection(name)
        .replaceOne({ _id: lastIns._id }, newData);
  }

  async getSnapshot({ streamId, aggregate, reducer, shouldSave = true }) {
    if (!(reducer instanceof IReducer)) {
      throw new Error("reducer ins must inherit from IReducer");
    }
    const version = reducer.getVersion();
    const query = {
      aggregateId: streamId,
      aggregate,
      version,
    };

    let [snapshot, stream] = await this._getFromSnapshotAsync(query);
    if (snapshot && snapshot.version !== version) {
      this._log("Delete old version", snapshot);
      await this._deleteSnapshotAsync(snapshot._id);
      [snapshot, stream] = await this._getFromSnapshotAsync(query);
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
      position: stream.lastPosition,
      updatedAt: new Date(),
      version,
    };

    if (shouldSave && events.length > 0) {
      this._log("Updated snapshot \n", snapShotData);

      await this._createSnapshotAsync(snapshot, {
        ...query,
        data: snapShotData,
        position: stream.lastPosition,
        version,
      });
    }

    return snapShotData;
  }

  _log() {
    console.log(...arguments);
  }
}

module.exports = {
  SnapshotStore,
  IReducer,
};
