import "reflect-metadata";

const SymbolAllSteps = Symbol("state:allSteps");

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
      const logs = (this as any).logs ?? [];
      const state = (this as any).state ?? {};
      const logItm = {
        _t: new Date(),
        action: "call",
        method: propertyKey,
        prevState: structuredClone(state),
        newState: undefined,
      };
      logs.push(logItm);
      const res = originalFunc.apply(this, arguments);
      logItm.newState = structuredClone((this as any).state ?? {});
      return res;
    };
  };
}

class StateMachine {
  state = {
    step: "",
    count: 0,
  };
  logs = [];

  constructor(initVal: number) {
    this.state.count = initVal;
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
}

async function main() {
  const ins = new StateMachine(0);

  console.log("metadata:");
  const allSteps = Reflect.getMetadata(SymbolAllSteps, ins);
  console.log("\t allSteps:", allSteps);

  console.log("start");
  await ins.step1(5);
  await ins.step2(3);

  console.log(ins.logs);
}
main();

// metadata:
//          allSteps: [ "step1", "step2" ]
// start
// [
//   {
//     _t: 2024-06-15T06:06:47.800Z,
//     action: "call",
//     method: "step1",
//     prevState: {
//       step: "",
//       count: 0,
//     },
//     newState: {
//       step: "step_1",
//       count: 5,
//     },
//   }, {
//     _t: 2024-06-15T06:06:47.800Z,
//     action: "call",
//     method: "step2",
//     prevState: {
//       step: "step_1",
//       count: 5,
//     },
//     newState: {
//       step: "step_2",
//       count: 2,
//     },
//   }
// ]
