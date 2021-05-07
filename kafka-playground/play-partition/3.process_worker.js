const { Kafka } = require("kafkajs");

const KAFKA_BROKER = ["localhost:9092"];

const kafka = new Kafka({
  brokers: KAFKA_BROKER,
});

const topic = "cmdQueue";
const consumer = kafka.consumer({ groupId: "cmdQueueWorker" });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic,
    fromBeginning: true,
  });
  await consumer.run({
    // eachBatch: async ({ batch }) => {
    //   console.log(batch)
    // },
    eachMessage: async ({ topic, partition, message }) => {
      const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
      console.log(`- ${prefix} ${message.key}#${message.value}`);
    },
  });
};

const errorTypes = ["unhandledRejection", "uncaughtException"];
const signalTraps = ["SIGTERM", "SIGINT", "SIGUSR2"];

errorTypes.map((type) => {
  process.on(type, async (e) => {
    try {
      console.log(`process.on ${type}`);
      console.error(e);
      await consumer.disconnect();
      process.exit(0);
    } catch (_) {
      process.exit(1);
    }
  });
});

signalTraps.map((type) => {
  process.once(type, async () => {
    try {
      await consumer.disconnect();
    } finally {
      process.kill(process.pid, type);
    }
  });
});

async function main() {
  try {
    run();
  } catch (e) {
    console.error(`[example/consumer] ${e.message}`, e);
  }
}
main();
