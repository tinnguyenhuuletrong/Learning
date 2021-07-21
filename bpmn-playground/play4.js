// process.env.DEBUG = "bpmn-engine:*";

const EventEmitter = require("events").EventEmitter;
const Bpmn = require("bpmn-engine");
const fs = require("fs");
const { promisify } = require("util");

const waitForMs = promisify(setTimeout);

// Timer follow iso8601-duration
// P<Date>T>Time
// PT1M => 1 min

async function main() {
  const engine = Bpmn.Engine({
    name: "payment process event",
    source: fs.readFileSync("./model/event_test.bpmn"),
    moddleOptions: {
      camunda: require("camunda-bpmn-moddle/resources/camunda"),
    },
    services: {},
    extensions: {},
  });

  const variables = {};
  const listener = new EventEmitter();

  try {
    console.log("begin");

    [api, waitForEnd] = await exec({ engine, variables, listener });
    [activity, evt, timer, signal] = api.getPostponed();

    // signal:
    //  api.getActivityById('signal').getApi().signal()
    //  signal.signal()

    // event
    //  event.signal()

    // Timmer
    //  will end after 1M

    await waitForEnd;

    console.log("finish", api.state, api.environment.output);
    console.log(
      "final state saved",
      require("fs").writeFileSync(
        "./saved_4.json",
        JSON.stringify(api.getState())
      )
    );
  } catch (error) {
    console.error(error);
  }
}

async function exec({ engine, variables, listener }) {
  const waitForEnd = engine.waitFor("end");
  listener.on("activity.start", (m) => console.log("activity.start", m.id));
  listener.on("activity.end", (m) => console.log("activity.end", m.id));
  listener.on("flow.take", (m) => console.log("\t flow.take", m.id));

  const api = await engine.execute({ variables, listener });
  return [api, waitForEnd];
}

main();
