const { ServiceBroker } = require("moleculer");

async function main() {
  // Create a ServiceBroker
  const broker = new ServiceBroker({
    nodeID: "cli-agent",
    transporter: {
      type: "kafka",
      options: {
        host: "localhost:9092",
      },
    },
  });

  await broker.start();

  await broker.repl();
}

main();
