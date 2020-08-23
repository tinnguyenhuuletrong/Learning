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

  /**
   * Query event by revision for (streamId, aggregate)
   *
   */
  async getEventRevisions({ streamId, aggregate, revMin = 0, revMax = -1 }) {
    this._log("getEventRevisions", arguments);
    return new Promise((resolve, reject) => {
      this.es.getEventsByRevision(
        {
          aggregateId: streamId,
          aggregate,
        },
        revMin,
        revMax,
        function (err, data) {
          if (err) reject(err);
          else resolve(data);
        }
      );
    });
  }

  /**
   * Query event by position. Which always inc for `streamId`
   *
   */
  async getEventPositions({ streamId, aggregate, revMin = 0, revMax = -1 }) {
    this._log("getEventPositions", arguments);

    const findOptions = {
      aggregateId: streamId,
    };
    if (aggregate) {
      findOptions.aggregate = aggregate;
    }

    let streamRevOptions = { $gte: revMin, $lt: revMax };
    if (revMax === -1) {
      streamRevOptions = { $gte: revMin };
    }
    return await this.es.store.events
      .find(
        {
          ...findOptions,
          position: streamRevOptions,
        },
        {
          sort: {
            position: 1,
          },
        }
      )
      .toArray();
  }

  _log() {
    console.log(...arguments);
  }
}

// -------------------------------------------------------//
//  Promisify
// -------------------------------------------------------//

function promisifyEs(es) {}
// -------------------------------------------------------//

module.exports = {
  EventStore,
};
