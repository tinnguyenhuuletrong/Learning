const { KafkaStreams, KStorage } = require("kafka-streams");
const fs = require("fs");

/**
 *
 * book_domain -> {id:uuid, name, author}
 *
 * save to table
 */

const TOPIC = "book_domain";
const LOCAL_DB = "./book.db.json";

const kafkaStreams = new KafkaStreams({
  // https://github.com/edenhill/librdkafka/blob/master/CONFIGURATION.md
  noptions: {
    "metadata.broker.list": "localhost:9092",
    "group.id": "c1",
    "enable.auto.commit": true,
    "auto.commit.interval.ms": 100,
    "allow.auto.create.topics": true,
  },
});

function load() {
  if (!fs.existsSync("./book.db.json")) return {};
  const data = fs.readFileSync("./book.db.json");
  return JSON.parse(data);
}

async function save() {
  console.log("flush");

  fs.writeFileSync(
    "./book.db.json",
    JSON.stringify(await storage.getState(), null, 2)
  );
  console.log("flush done");
}

const storage = new KStorage();
storage.setState(load());

const table = kafkaStreams.getKTable(
  TOPIC,
  (message) => {
    return {
      key: message.key.toString(),
      value: JSON.parse(message.value.toString()),
    };
  },
  storage
);

table
  .map((el) => {
    console.log("aaaa", el);
    const { key, value } = el;
    return {
      key,
      value: JSON.stringify(value),
    };
  })
  .drain();

async function main() {
  await table.start();
  console.log("started");
}

main();
process.on("SIGINT", () => {
  save();
  kafkaStreams.closeAll();
});
