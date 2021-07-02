process.env.DEBUG = "bpmn-engine:*";

const Bpmn = require("bpmn-engine");
const fs = require("fs");


function ServiceExpression (activity) {
  const { type: atype, behaviour, environment } = activity;
  const expression = behaviour.expression;

  const type = `${atype}:expression`;

  return {
    type,
    expression,
    execute,
  };

  function execute (executionMessage, callback) {
    const serviceFn = environment.resolveExpression(expression, executionMessage);
    serviceFn.call(activity, executionMessage, (err, result) => {
      callback(err, result);
    });
  }
}

async function main () {
  const engine = Bpmn.Engine({
    name: "simple flow",
    source: fs.readFileSync("./model/simple.bpmn"),
    moddleOptions: {
      camunda: require('camunda-bpmn-moddle/resources/camunda')
    },
    services: {
      echo: (scope, callback) => {
        console.log("echo", scope);
        callback(null, { data: 'hello from node' })
      },
    },
    extensions: {
      camundaServiceTask (activity) {
        if (activity.behaviour.expression) {
          activity.behaviour.Service = ServiceExpression;
        }
        if (activity.behaviour.resultVariable) {
          activity.on('end', (api) => {
            activity.environment.output[activity.behaviour.resultVariable] = api.content.output;
          });
        }
      },
    }
  });

  const variables = {};
  const api = await engine.execute({});

  console.log(api.environment.output)
}

main();
