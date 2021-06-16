const ZB = require("zeebe-node");

async function main() {
  //  processId get from Diagram
  //  https://console.cloud.camunda.io/org/3e7053f3-d867-41c1-83b7-5bbae0882adc/models

  const zbc = new ZB.ZBClient();
  const result = await zbc.deployWorkflow("./bpmn/KYC_greater_than_18.bpmn");
  console.log(result);
}
main();
