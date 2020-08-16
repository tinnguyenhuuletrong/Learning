const { promisify } = require("util");

const eventstore = require("eventstore");
const es = eventstore({
  // type: "redis",
  type: "mongodb",
  url: "mongodb://localhost/event-store",
  useUndispatchedEventsTable: true,
  // eventsCollectionName: "events", // optional
  // snapshotsCollectionName: "snapshots", // optional
  // transactionsCollectionName: "transactions" // optional
  // positionsCollectionName: "positions", // optioanl, defaultly wont keep position
});

const waitMs = promisify(setTimeout);

es.on("connect", function () {
  console.log("storage connected");
});

es.on("disconnect", function () {
  console.log("connection to storage is gone");
});

es.useEventPublisher(function (evt) {
  // bus.emit('event', evt);
  // console.log(evt);
  onEventPublish(evt);
});

es.init(() => {
  printHelp();
});

function createEvent(type, ...others) {
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
    userData: {},
  });
}

function evStartReview({ clientId, userId }) {
  return createEvent("startReview", {
    clientId,
    userId,
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

//---------------
// Utils
//---------------
function addEvents(streamId, aggregateId, events) {
  return new Promise((reolsve, reject) => {
    es.getEventStream(
      { aggregateId: streamId, aggregate: aggregateId },
      function (err, stream) {
        console.error(err);
        stream.addEvents(events);
        stream.commit(function (err, stream) {
          if (err) reject(err);
          else reolsve(stream.eventsToDispatch);
        });
      }
    );
  });
}

async function simulate1(userId = "1") {
  const clientId = "client_1";
  const promiseId = "p1";
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
  await addEvents(`kyc:${clientId}`, `${userId}`, batchevents1);

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

  await addEvents(`kyc:${clientId}`, `${userId}`, batchevents2);
}

async function scan(userId) {
  const clientId = "client_1";
  const skip = 0;
  const limit = 100;
  es.getEvents(
    {
      aggregateId: `kyc:${clientId}`,
      aggregate: userId,
    },
    skip,
    limit,
    function (err, data) {
      console.log(data);
    }
  );
}

async function onEventPublish(evt) {
  console.log(evt);
}

function printHelp() {
  console.log("supported:");
  console.log("-  simulate1(<userId>)");
  console.log("-  scan(<userId>|null)");
}
