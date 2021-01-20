const { ServiceBroker } = require("moleculer");

async function main() {
  // Create a ServiceBroker
  const broker = new ServiceBroker({
    nodeID: "cli-agent",
    transporter: "TCP",
  });

  await broker.start();

  await broker.repl();
}

main();
