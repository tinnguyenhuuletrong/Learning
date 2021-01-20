const { ServiceBroker } = require("moleculer");
const MathService = require("../services/mathService");
const EventListernerService = require("../services/eventListernerService");

async function main() {
  // Create a ServiceBroker
  const broker = new ServiceBroker({
    nodeID: "service-a",
    metrics: true,
    transporter: "TCP",
  });

  // Services
  broker.createService(MathService);
  broker.createService(EventListernerService);

  broker.start();
}

main();
