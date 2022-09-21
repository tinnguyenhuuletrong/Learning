import * as swc from "@swc/core";
import { TLiteJITEngine, RuntimeContext } from "./TLiteJITEngine";
import { wrappedWithFuncCallLog } from "./proxyHelper";
import { isArray, isFunction } from "lodash";

// https://astexplorer.net/

const code = `
function add(a, b) {
  if(a < 10) return 1
  return a + b
}
res = add(1,2)
`;

const res = swc.parseSync(code);
const ins = wrappedWithFuncCallLog(new TLiteJITEngine());
const ctx = new RuntimeContext();
ctx.mem = { inp: 2 };
ctx.funcDb["map"] = (inp, func) => {
  if (!isFunction(func)) throw new Error("arg1 is not a function");
  if (!isArray(inp)) throw new Error("arg0 is not a array");
  return inp.map((itm) => func(itm));
};

const finalVal = ins.run(res, ctx);
console.dir(
  {
    ctx: ctx,
  },
  { depth: 5 }
);
