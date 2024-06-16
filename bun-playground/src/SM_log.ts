import "reflect-metadata";

const SymbolAllSteps = Symbol("state:allSteps");
const SymbolActiveAction = Symbol("state:runtime:activeAction");

const attachProxy = (
  target: any,
  doTrackChange: (ins: any, prop: string | Symbol, value: any) => void,
  ins?: any
) => {
  return new Proxy(target, {
    set: function set(obj, prop, value) {
      doTrackChange(ins, prop, value);
      return Reflect.set(obj, prop, value);
    },
  });
};

const JSONClone = (v: any) => JSON.parse(JSON.stringify(v));

function Action() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    // Metadata for steps collect
    const allSteps = Reflect.getMetadata(SymbolAllSteps, target) ?? [];
    Reflect.defineMetadata(SymbolAllSteps, [...allSteps, propertyKey], target);

    const originalFunc: Function = descriptor.value;
    descriptor.value = async function () {
      const logs = Reflect.get(this, "logs") ?? [];
      const logItm = {
        _t: new Date(),
        action: "action_call",
        method: propertyKey,
        children: [],
      };
      logs.push(logItm);

      // set call context
      Reflect.set(this, SymbolActiveAction, logItm);
      const res = originalFunc.apply(this, arguments);

      // reset it to undefined
      Reflect.set(this, SymbolActiveAction, undefined);
      return res;
    };
  };
}

function State() {
  return function (target: any, propertyKey: string) {
    let val: any;
    const doTrackChange = (ins: any, prop: string | Symbol, value: any) => {
      // get parent call context
      const _currentAction = Reflect.get(ins, SymbolActiveAction);
      const logs = _currentAction?.children ?? [];
      logs.push({
        _t: new Date(),
        action: "state_change",
        prop,
        value,
      });
    };

    Object.defineProperty(target, propertyKey, {
      get() {
        return val;
      },
      set(v) {
        if (val !== undefined) throw new Error("Readonly property");
        val = attachProxy(v, doTrackChange, this);
      },
    });
  };
}

type StateData = {
  step: string;
  count: number;
};

class StateMachine {
  @State()
  private readonly state: StateData;
  private readonly logs = [];

  constructor(initVal: StateData) {
    this.state = initVal;
  }

  @Action()
  async step1(incWith: number) {
    this.state.step = "step_1";
    this.state.count += incWith;
    return true;
  }

  @Action()
  async step2(decWith: number) {
    this.state.step = "step_2";
    this.state.count -= decWith;
    return true;
  }

  toJSON() {
    const { state, logs } = this;
    return { state: JSONClone(state), logs: structuredClone(logs) };
  }
}

async function main() {
  const ins = new StateMachine({
    step: "",
    count: 0,
  });

  console.log("metadata:");
  const allSteps = Reflect.getMetadata(SymbolAllSteps, ins);
  console.log("\t allSteps:", allSteps);

  console.log("start");
  await ins.step1(5);
  await ins.step2(3);

  console.dir(ins.toJSON(), { depth: 10 });
}
main();

// metadata:
//          allSteps: [ "step1", "step2" ]
// start
// {
//   state: {
//     step: "step_2",
//     count: 2,
//   },
//   logs: [
//     {
//       _t: 2024-06-16T03:03:52.014Z,
//       action: "action_call",
//       method: "step1",
//       children: [
//         {
//           _t: 2024-06-16T03:03:52.014Z,
//           action: "state_change",
//           prop: "step",
//           value: "step_1",
//         }, {
//           _t: 2024-06-16T03:03:52.014Z,
//           action: "state_change",
//           prop: "count",
//           value: 5,
//         }
//       ],
//     }, {
//       _t: 2024-06-16T03:03:52.014Z,
//       action: "action_call",
//       method: "step2",
//       children: [
//         {
//           _t: 2024-06-16T03:03:52.014Z,
//           action: "state_change",
//           prop: "step",
//           value: "step_2",
//         }, {
//           _t: 2024-06-16T03:03:52.014Z,
//           action: "state_change",
//           prop: "count",
//           value: 2,
//         }
//       ],
//     }
//   ],
// }
