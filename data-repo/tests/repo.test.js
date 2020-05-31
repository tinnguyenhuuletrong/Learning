const { promisify } = require("util");
const { EventEmitter } = require("events");
const redis = require("redis");

/** @type {import('../@types/index')} */
const DataRepo = require("../src");
const {
  start,
  stop,
  createDataRepo,
  createDataRepoRemote,
  createRpcClient,
} = DataRepo;

const MemoryStore = require("../src/storages/MemoryStore");
const waitMs = (ms) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

const URI = "redis://127.0.0.1:6379";

/** @type {import('redis').RedisClient} */
let redisClient;

const DummyDataSource = {
  findAsync: async () => {},
  on: () => {},
  off: () => {},
};

async function waitForConnect(client) {
  return new Promise((resolve, reject) => {
    client.once("connect", () => resolve(client));
    client.once("error", () => reject());
  });
}

beforeAll(async () => {
  redisClient = redis.createClient(URI);
  await waitForConnect(redisClient);
  await start(redisClient);
});

afterAll(async () => {
  redisClient.end(true);
  await stop();
});

test("DataRepo - rpc test", async () => {
  const ins = await createDataRepo({
    topic: "DomainA",
    dataSource: DummyDataSource,
  });
  await ins.start();

  const topic = ins.rpcServer.getRpcTopic();
  const client = await createRpcClient();

  const jobs = new Array(3).fill(1).map((k) =>
    client.request({
      ...topic,
      msg: {
        cmd: "ping",
      },
    })
  );

  expect(await Promise.all(jobs)).toMatchSnapshot();

  await ins.stop();
});

test("DataRepo - query data sources", async () => {
  const TestDataSource = {
    ...DummyDataSource,
    findAsync: async (query) => {
      return [
        {
          id: 0,
          name: "t1",
        },
        {
          id: 1,
          name: "t2",
        },
      ];
    },
  };

  const ins = await createDataRepo({
    topic: "DomainA",
    dataSource: TestDataSource,
  });
  await ins.start();

  const topic = ins.rpcServer.getRpcTopic();
  const client = await createRpcClient();

  const res = await client.request({
    ...topic,
    msg: {
      cmd: "find",
      query: {},
    },
  });

  expect(res).toMatchSnapshot();

  await ins.stop();
});

test("DataRepo - event", async () => {
  const TestDataSource = new EventEmitter();
  TestDataSource.findAsync = async () => [];

  const ins = await createDataRepo({
    topic: "DomainA",
    dataSource: TestDataSource,
  });
  await ins.start();

  const mockFunc = jest.fn();
  ins.stream.addToStream = mockFunc;

  TestDataSource.emit("created", {
    id: 2,
    name: "new",
  });

  TestDataSource.emit("updated", {
    id: 2,
    name: "new_1",
  });

  TestDataSource.emit("deleted", {
    id: 2,
  });

  expect(mockFunc).toMatchSnapshot();

  await ins.stop();
});

test("DataRepo - remote", async () => {
  const TestDataSource = new EventEmitter();
  TestDataSource.findAsync = async (query) => {
    return [
      {
        _id: 0,
        name: "t1",
      },
      {
        _id: 1,
        name: "t2",
      },
    ];
  };

  const topic = "DomainA";
  const memStore = new MemoryStore();
  const repoIns = await createDataRepo({
    topic,
    dataSource: TestDataSource,
  });
  await repoIns.start();

  const remoteIns = await createDataRepoRemote({
    topic,
    dataStore: memStore,
  });
  await remoteIns.start();

  console.log(memStore);
  expect(memStore.toObjects()).toMatchSnapshot({
    head: expect.any(String),
  });

  // Emit some change
  TestDataSource.emit("created", {
    _id: 2,
    name: "new",
  });
  TestDataSource.emit("updated", {
    _id: 1,
    name: "updated name",
  });
  TestDataSource.emit("deleted", {
    _id: 0,
  });

  await waitMs(1000);

  // Should sync
  console.log(memStore);
  expect(memStore.toObjects()).toMatchSnapshot({
    head: expect.any(String),
  });

  await repoIns.stop();
  await remoteIns.stop();
}, 10000);
