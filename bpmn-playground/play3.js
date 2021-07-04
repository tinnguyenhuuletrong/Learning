// process.env.DEBUG = "bpmn-engine:*";

const EventEmitter = require("events").EventEmitter;
const Bpmn = require("bpmn-engine");
const fs = require("fs");
const { promisify } = require("util");

const waitForMs = promisify(setTimeout);

function ServiceExpression(activity) {
  const { type: atype, behaviour, environment } = activity;
  const expression = behaviour.expression;

  const type = `${atype}:expression`;

  return {
    type,
    expression,
    execute,
  };

  function execute(executionMessage, callback) {
    const serviceFn = environment.resolveExpression(
      expression,
      executionMessage
    );

    executionMessage.environment = environment;
    serviceFn.call(activity, executionMessage, (err, result) => {
      callback(err, result);
    });
  }
}

async function main() {
  const engine = Bpmn.Engine({
    name: "payment process event",
    source: fs.readFileSync("./model/payment_event.bpmn"),
    moddleOptions: {
      camunda: require("camunda-bpmn-moddle/resources/camunda"),
    },
    services: {
      doPayment: (scope, callback) => {
        const { pid, pvalue = 2000 } = scope.environment.variables;
        console.log("doPayment", { pid, pvalue });
        callback(null, { value: pvalue });
      },
      doShipWithInsurance: (scope, callback) => {
        callback(null, { shipType: "safe" });
      },
      doShipWithoutInsurance: (scope, callback) => {
        callback(null, { shipType: "unsafe" });
      },
      gt(v1, v2) {
        console.log("gt", v1, v2);
        return v1 > v2;
      },
    },
    extensions: {
      camunda(activity, context) {
        if (activity.behaviour.expression) {
          activity.behaviour.Service = ServiceExpression;
        }
        if (activity.behaviour.resultVariable) {
          activity.on("end", (api) => {
            activity.environment.output[activity.behaviour.resultVariable] =
              api.content.output;
          });
        }
      },
    },
  });

  const variables = {
    pid: 1,
    pvalue: 10,
  };
  const listener = new EventEmitter();

  listener.on("flow.take", (flow) =>
    console.log(`\tflow <${flow.id}> was taken`)
  );

  // option 1
  listener.on("wait", async (eventObj, api) => {
    const { type, id, executionId } = eventObj;

    console.log("Wait for event ", { type, id, executionId });

    switch (id) {
      case "Ev_payment_recieved":
        {
          // bpmn:MessageEventDefinition
          console.log("processing", eventObj.name);
          await waitForMs(2000);

          console.log("finish", eventObj.name);

          // update env
          eventObj.environment.output.paymentEvent = {
            status: "success",
            _t: new Date(),
          };

          eventObj.signal({
            id,
            status: "success",
          });
          // eventObj.discard();
        }
        break;
    }
  });

  const api = await engine.execute({ variables, listener });
  await api.waitFor("end");

  console.log("finish", api.state, api.environment.output);
  console.log(
    "final state saved",
    require("fs").writeFileSync(
      "./saved_3.json",
      JSON.stringify(api.getState())
    )
  );
}

main();
