const { KafkaStreams, KStorage } = require("kafka-streams");

/**
 *
 * book_domain -> {id:uuid, name, author}
 *
 * save to table
 */

const kafkaStreams = new KafkaStreams({
  noptions: {
    "metadata.broker.list": "localhost:9092",
    "group.id": "p1",
    "enable.auto.commit": true,
    "auto.commit.interval.ms": 100,
    "allow.auto.create.topics": true,
  },
});

const inputStream = kafkaStreams.getKStream();
inputStream.to("book_domain", 1, "send");

async function main() {
  await inputStream.start();

  producer();
}

function randomInArray(arr = []) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function producer() {
  console.log("producer started");

  setInterval(() => {
    const msg = JSON.stringify({
      name: "name 1",
      author: "author 1",
    });

    const payload = {
      id: `uuid-${Date.now()}`,
      key: randomInArray([`book_1`, `book_2`, `book_3`, "book_4"]),
      value: msg,
      timestamp: new Date(),
      version: 1,
    };
    console.log(payload);
    inputStream.writeToStream(payload);
  }, 100);
}

main();
