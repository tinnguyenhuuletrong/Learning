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
    pvalue: 5000,
  };
  const listener = new EventEmitter();

  listener.on("flow.take", (flow) =>
    console.log(`\tflow <${flow.id}> was taken`)
  );
  try {
    const api = await engine.execute({ variables, listener });
    const [waitingPaymentRecieved] = await api.getPostponed();
    await waitForMs(2000);
    waitingPaymentRecieved.signal({
      status: "success",
    });

    console.log("finish", api.state, api.environment.output);
    console.log(
      "final state saved",
      require("fs").writeFileSync(
        "./saved_3_2.json",
        JSON.stringify(api.getState())
      )
    );
  } catch (error) {
    console.error(error);
  }
}

main();
