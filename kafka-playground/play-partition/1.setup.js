const { Kafka, ConfigResourceTypes } = require("kafkajs");
const KAFKA_BROKER = ["localhost:9092"];
const kafka = new Kafka({ brokers: KAFKA_BROKER });
const admin = kafka.admin();

async function main() {
  await admin.connect();

  await createTopic();
  await topicMeta();

  await admin.disconnect();
}

async function createTopic() {
  let allTopics = await admin.listTopics();
  console.log("allTopics", allTopics);

  await admin.createTopics({
    topics: [
      {
        topic: "cmdQueue",
        numPartitions: 4,
      },
    ],
  });

  allTopics = await admin.listTopics();
  console.log("allTopics", allTopics);
}

async function topicMeta() {
  const meta = await admin.fetchTopicMetadata("cmdQueue");
  console.dir(meta, { depth: 100 });
}

main();
