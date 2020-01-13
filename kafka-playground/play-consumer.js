const { Kafka } = require("kafkajs");

const KAFKA_BROKER = ["localhost:9092"];

const kafka = new Kafka({
  clientId: "my-app",
  brokers: KAFKA_BROKER
});

async function main() {
  console.log("call start(groupname)");
}

async function start(groupId) {
  console.log("start with groupId", groupId);
  const consumerIns = kafka.consumer({ groupId });

  await consumerIns.connect();
  console.log("connected");

  const topic = "simple";
  let res = await consumerIns.subscribe({ topic, fromBeginning: true });
  console.log("subcrible to", topic, "group", groupId, "--", res);
  res = await consumerIns.run({
    eachMessage: onMessage
  });
  console.log("end", "--", res);
}

async function onMessage({ topic, partition, message }) {
  console.log({
    key: message.key.toString(),
    value: message.value.toString(),
    headers: message.headers
  });
}

main();

async function stop() {
  const res = await consumerIns.disconnect();
  console.log("stop", res);
}

process.on("exit", async () => {
  stop();
});
