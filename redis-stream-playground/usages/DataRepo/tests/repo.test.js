const { EventEmitter } = require("events");
const redis = require("redis");
const DataRepo = require("../src/Repo");
const RpcClient = require("../src/RpcClient");
const PubSub = require("../src/PubSub");
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
  PubSub.start(redisClient);
});

afterAll(() => {
  redisClient.end(true);
  PubSub.stop();
});

test("DataRepo - rpc test", async () => {
  const ins = new DataRepo(redisClient, "DomainA", DummyDataSource);
  await ins.start();

  const topic = ins.rpcServer.getRpcTopic();
  const client = new RpcClient();

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

  const ins = new DataRepo(redisClient, "DomainA", TestDataSource);
  await ins.start();

  const topic = ins.rpcServer.getRpcTopic();
  const client = new RpcClient();

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

  const ins = new DataRepo(redisClient, "DomainA", TestDataSource);
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
