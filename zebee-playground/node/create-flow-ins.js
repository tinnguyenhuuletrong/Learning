const ZB = require("zeebe-node");

async function main() {
  //  processId get from Diagram
  //  https://console.cloud.camunda.io/org/3e7053f3-d867-41c1-83b7-5bbae0882adc/models

  const zbc = new ZB.ZBClient();
  const result = await zbc.createWorkflowInstanceWithResult({
    bpmnProcessId: "Process_KYC_greater_than_18_e1cd6352",
    variables: {},
  });
  console.log(result);
}
main();
