import * as swc from "@swc/core";
import { TLiteExpVisitor, RuntimeContext } from "./TLiteExpVisitor";
import { wrappedWithFuncCallLog } from "./proxyHelper";
import { isArray, isFunction } from "lodash";

// https://astexplorer.net/
const code = `
f = tmp => tmp + 1
res = f(1) * f(5)
`;

const res = swc.parseSync(code);
const ins = wrappedWithFuncCallLog(new TLiteExpVisitor());
const ctx = new RuntimeContext();
ctx.mem = { inp: "hello" };
ctx.funcDb["toUpper"] = (inp) => {
  return String(inp).toUpperCase();
};
ctx.funcDb["toString"] = (inp) => String(inp);
ctx.funcDb["isOdd"] = (inp) => parseInt(inp) % 2 !== 0;
ctx.funcDb["plusOne"] = (inp) => parseInt(inp) + 1;
ctx.funcDb["map"] = (inp, func) => {
  if (!isFunction(func)) throw new Error("arg1 is not a function");
  if (!isArray(inp)) throw new Error("arg0 is not a array");
  return inp.map((itm) => func(itm));
};
ctx.funcDb["filter"] = (inp, func) => {
  if (!isFunction(func)) throw new Error("arg1 is not a function");
  if (!isArray(inp)) throw new Error("arg0 is not a array");
  return inp.filter((itm) => func(itm));
};

const finalVal = ins.run(res, ctx);
console.dir(
  {
    ctx: ctx,
  },
  { depth: 5 }
);
