const { Kafka } = require("kafkajs");
const { E_TYPE } = require("./type");

const KAFKA_BROKER = ["localhost:9092"];

const kafka = new Kafka({
  clientId: "my-app",
  brokers: KAFKA_BROKER,
});

const ByUserIdPartitioner = () => {
  return ({ topic, partitionMetadata, message }) => {
    const userId = JSON.parse(message.value).userId;
    const partitionCount = partitionMetadata.length;
    return userId % partitionCount;
  };
};

const producerIns = kafka.producer({
  allowAutoTopicCreation: true,
  createPartitioner: ByUserIdPartitioner,
});

function rand(items) {
  // "~~" for a closest "int"
  return items[~~(items.length * Math.random())];
}

async function main() {
  await producerIns.connect();
  console.log("connected");

  const userId = rand([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

  const res = await send("cmdQueue", {
    value: {
      userId: userId,
      cmd: {
        type: E_TYPE.ADD,
        value: 1,
      },
    },
  });

  console.log("cmd sent", res);

  await producerIns.disconnect();
}

async function send(topic, { key, value }) {
  const res = await producerIns.send({
    topic,
    messages: [
      {
        key,
        value: JSON.stringify(value),
      },
    ],
  });
  return res;
}

main();
