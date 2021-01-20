const { ServiceBroker } = require("moleculer");

async function main() {
  // Create a ServiceBroker
  const broker = new ServiceBroker({
    nodeID: "agent",
    transporter: "TCP",
  });

  await broker.start();

  await broker.waitForServices(["math"]);

  console.log(
    "math.add",
    await broker.call("math.add", {
      a: 1,
      b: 2,
    })
  );

  console.log("math.fibo", await broker.call("math.fibo", { index: 10 }));
}

main();
