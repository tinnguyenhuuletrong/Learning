const { KafkaStreams, KStorage } = require("kafka-streams");
const fs = require("fs");
const faker = require("faker");

function load() {
  if (!fs.existsSync("./db.json")) return {};
  const data = fs.readFileSync("./db.json");
  return JSON.parse(data);
}

async function save() {
  console.log("flush");

  fs.writeFileSync(
    "./db.json",
    JSON.stringify(await storage.getState(), null, 2)
  );

  console.log("flush done");
}

const kafkaStreams = new KafkaStreams({
  kafkaHost: "localhost:9092",
  groupId: "c3",
  // workerPerPartition: 1,
});

kafkaStreams.on("error", (error) => {
  console.log("Error occured:", error.message);
});

const storage = new KStorage();
storage.setState(load());
const stream = kafkaStreams.getKStream("my-input-topic", storage);

stream
  .map((kafkaMessage) => {
    const value = kafkaMessage.value.toString("utf8");
    const elements = value.toLowerCase().split(" ");
    return {
      id: elements[0],
    };
  })
  .countByKey("id", "count")
  .tap((kv) => console.log(kv))
  .map((v) => JSON.stringify(v))

  .to("my-output-topic");

const inputStream = kafkaStreams.getKStream();
inputStream.to("my-input-topic");

const produceInterval = setInterval(() => {
  inputStream.writeToStream(faker.lorem.word());
}, 100);

Promise.all([stream.start(), inputStream.start()]).then(() => {
  console.log("started..");
  // // produce & consume for 5 seconds
  // setTimeout(async () => {
  //   clearInterval(produceInterval);
  //   kafkaStreams.closeAll();
  //   console.log("stopped..");
  // }, 5000);
});

process.on("SIGINT", () => save());
