global.GlobalConfig = { MONGODB_ES_URI: "mongodb://localhost/event-store" };
const { promisify } = require("util");
const { EventStore, IReducer } = require("./lib/EventStore");
const waitMs = promisify(setTimeout);

const es = new EventStore({
  eventsCollectionName: "events",
});

async function main() {
  await es.start();
  printHelp();
}

function printHelp() {
  console.log("supported:");
  console.log("-  simulate1(<userId>)");
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
      console.log(this.state, iterator);
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
      }
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
  const sc = await es.getSnapshot({
    streamId: `kyc:${clientId}`,
    aggregate: `${userId}`,
    reducer: promiseReducer,
    shouldSave: true,
  });

  console.log(sc);
}

main();
