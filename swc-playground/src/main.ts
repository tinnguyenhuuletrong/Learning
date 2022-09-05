import * as swc from "@swc/core";
import { TLiteExpVisitor, RuntimeContext } from "./TLiteExpVisitor";
import { wrappedWithFuncCallLog } from "./proxyHelper";
import { isArray, isFunction } from "lodash";

// https://astexplorer.net/
const code = `
function add(a, b) {
  c = a * 2
  return a + b + c
}
mul = (a,b) => a * b
res = add(1,2) + mul(5,6)
`;

const res = swc.parseSync(code);
const ins = wrappedWithFuncCallLog(new TLiteExpVisitor());
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
