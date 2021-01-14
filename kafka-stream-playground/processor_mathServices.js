const { KafkaStreams, KStorage } = require("kafka-streams");

/**
 *
 * input -> {id:uuid, op: enum('+', '-', '*', '/), v1: number, v2: number}
 *
 * process -> output
 */

const kafkaStreams = new KafkaStreams({
  // https://github.com/edenhill/librdkafka/blob/master/CONFIGURATION.md
  noptions: {
    "metadata.broker.list": "localhost:9092",
    "group.id": "p1",
    "enable.auto.commit": true,
    "auto.commit.interval.ms": 100,
    "allow.auto.create.topics": true,
  },
});

const processor = kafkaStreams.getKStream("input_math_service");

processor
  .map((kafkaMessage) => {
    const payload = JSON.parse(kafkaMessage.value.toString());
    return payload;
  })
  .asyncMap(async ({ id, op, v1, v2 }) => {
    let res;
    let isSuccess = true;
    switch (op) {
      case "+":
        res = v1 + v2;
        break;

      case "-":
        res = v1 - v2;
        break;

      case "*":
        res = v1 * v2;
        break;

      case "/":
        res = v1 / v2;
        break;

      default:
        isSuccess = false;
        res = "error";
        break;
    }

    return { id, result: res };
  })
  .tap((v) => console.log(v))
  .map((v) => JSON.stringify(v))
  .to("output_math_service");

async function main() {
  await Promise.all([processor.start()]);
  console.log("processor started");
}

main();
