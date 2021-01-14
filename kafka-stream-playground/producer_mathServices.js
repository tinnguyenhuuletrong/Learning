const { KafkaStreams, KStorage } = require("kafka-streams");

/**
 *
 * input -> {id:uuid, op: enum('+', '-', '*', '/), v1: number, v2: number}
 *
 * process -> output
 */

const kafkaStreams = new KafkaStreams({
  kafkaHost: "localhost:9092",
  groupId: "p2",
});

const inputStream = kafkaStreams.getKStream();
inputStream.to("input_math_service");

async function main() {
  await Promise.all([inputStream.start()]);
  producer();
}

function randomInArray(arr = []) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function producer() {
  console.log("producer started");

  const MAX = 10000;

  setInterval(() => {
    const msg = JSON.stringify({
      id: Date.now(),
      op: randomInArray(["+", "-", "*", "/"]),
      v1: Math.random() * MAX,
      v2: Math.random() * MAX,
    });
    console.log(msg);
    inputStream.writeToStream(msg);
  }, 100);

  return;
}

main();
