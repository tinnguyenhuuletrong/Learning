global.GlobalConfig = {
  MONGODB_ES_URI: "mongodb://localhost/event-store",
  MONGODB_SNAPSHOT_URI: "mongodb://localhost/event-store",
};
const { promisify } = require("util");
const { MongoClient } = require("mongodb");
const { EventStore } = require("./lib/EventStore");
const { SnapshotStore, IReducer } = require("./lib/SnapshotStore");
const waitMs = promisify(setTimeout);

const client = new MongoClient(global.GlobalConfig.MONGODB_SNAPSHOT_URI);
const es = new EventStore({
  eventsCollectionName: "events",
});
const snapStore = new SnapshotStore("kycPromise", es, {
  mongodbClient: client,
});
const snapStore1 = new SnapshotStore("kycStats", es, {
  mongodbClient: client,
});
async function main() {
  await es.start();
  await client.connect();
  printHelp();
}

function printHelp() {
  console.log("supported:");
  console.log("-  simulate1(<userId>)");
  console.log("-  simulate2(<userId>)");
  console.log("-  snapshot(<userId>)");
}

//-----------------------------------------------------------------------//
//  Events
//-----------------------------------------------------------------------//

function createEvent(type, others) {
  return { type, data: others };
}

function evRegister({ clientId, userId, promiseId }) {
  return createEvent("register", {
    clientId,
    userId,
    promiseId,
  });
}

function evUploadData({ clientId, userId, userData = {} }) {
  return createEvent("uploadData", {
    clientId,
    userId,
    userData,
  });
}

function evStartReview({ clientId, userId, reviewerId }) {
  return createEvent("startReview", {
    clientId,
    userId,
    reviewerId,
  });
}

function evReject({ clientId, userId, message }) {
  return createEvent("reject", {
    clientId,
    userId,
    message,
  });
}

function evApprove({ clientId, userId, message, certs }) {
  return createEvent("approve", {
    clientId,
    userId,
    message,
    certs,
  });
}

function evNoop({ clientId, userId }) {
  return createEvent("evNoop", {
    clientId,
    userId,
  });
}
const clientId = "client_1";

async function simulate1(userId = "1") {
  const promiseId = String(Date.now());
  const batchevents1 = [
    evRegister({
      clientId,
      userId,
      promiseId,
    }),
    evUploadData({
      clientId,
      userId,
      userData: {
        family_name: "a",
        given_name: "b",
      },
    }),
  ];

  await es.addEvents({
    streamId: `kyc:${clientId}`,
    aggregate: `${userId}`,
    events: batchevents1,
  });

  await waitMs(2000);

  const batchevents2 = [
    evStartReview({
      clientId,
      userId,
    }),
    evApprove({
      clientId,
      userId,
    }),
  ];

  await es.addEvents({
    streamId: `kyc:${clientId}`,
    aggregate: `${userId}`,
    events: batchevents2,
  });
}
async function simulate2(userId = "1") {
  const batchevents = [
    evNoop({
      clientId,
      userId,
    }),
  ];

  await es.addEvents({
    streamId: `kyc:${clientId}`,
    aggregate: `${userId}`,
    events: batchevents,
  });
}

//-----------------------------------------------------------------------//
//  Reducer
//-----------------------------------------------------------------------//

class KycPromiseReducer extends IReducer {
  constructor() {
    super();
    this.state = {
      status: "",
      transitionLogs: [],
    };
  }

  loadSnapshot(state) {
    this.state = { ...this.state, ...state };
    return this.state;
  }

  onEvents(events = []) {
    for (const iterator of events) {
      const {
        payload: { type, data },
        commitStamp,
      } = iterator;

      switch (type) {
        case "register":
          {
            const { promiseId } = data;
            this.state = {
              ...this.state,
              promiseId,
              status: "incomplete",
            };
          }
          break;

        case "uploadData":
          {
            const status = "waiting";
            const { transitionLogs } = this.state;
            this.state = {
              ...this.state,
              status,
              transitionLogs: [
                ...transitionLogs,
                {
                  from: this.state.status,
                  to: status,
                  _t: commitStamp,
                },
              ],
            };
          }
          break;

        case "startReview":
          {
            const status = "inreview";
            const { transitionLogs } = this.state;
            this.state = {
              ...this.state,
              status,
              transitionLogs: [
                ...transitionLogs,
                {
                  from: this.state.status,
                  to: status,
                  _t: commitStamp,
                },
              ],
            };
          }
          break;

        case "approve":
          {
            const status = "approve";
            const { transitionLogs } = this.state;
            this.state = {
              ...this.state,
              status,
              transitionLogs: [
                ...transitionLogs,
                {
                  from: this.state.status,
                  to: status,
                  _t: commitStamp,
                },
              ],
            };
          }
          break;
      }
    }
  }

  getSnap() {
    return this.state;
  }

  getVersion() {
    return 2;
  }
}

class KycStatsReducer extends IReducer {
  constructor() {
    super();
    this.state = {
      userIds: [],
    };
  }

  loadSnapshot(state) {
    this.state = { ...this.state, ...state };
    return this.state;
  }

  onEvents(events = []) {
    for (const iterator of events) {
      const {
        payload: { type, data },
        commitStamp,
      } = iterator;
      const { userId, clientId } = data;
      if (!this.state.userIds.includes(userId)) this.state.userIds.push(userId);
    }
  }

  getSnap() {
    return this.state;
  }

  getVersion() {
    return 1;
  }
}

async function snapshot(userId = 1) {
  const promiseReducer = new KycPromiseReducer();
  const sc = await snapStore.getSnapshot({
    streamId: `kyc:${clientId}`,
    aggregate: `${userId}`,
    reducer: promiseReducer,
    shouldSave: true,
  });
  console.log(sc);
}

async function snapshot1() {
  const statsReducer = new KycStatsReducer();
  const sc = await snapStore1.getSnapshot({
    streamId: `kyc:${clientId}`,
    reducer: statsReducer,
    shouldSave: true,
  });
  console.log(sc);
}

main();
