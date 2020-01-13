const { Kafka } = require("kafkajs");

const KAFKA_BROKER = ["localhost:9092"];

const kafka = new Kafka({
  clientId: "my-app",
  brokers: KAFKA_BROKER
});
const producerIns = kafka.producer({ allowAutoTopicCreation: true });

async function main() {
  await producerIns.connect();

  console.log("connected");
}

async function send(topic, key, payload) {
  const res = await producerIns.send({
    topic,
    messages: [
      {
        key: key || "default",
        value: payload
      }
    ]
  });
  console.log(res);
}

main();
