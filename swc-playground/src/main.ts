import * as swc from "@swc/core";
import { MathExpVisitor, RuntimeContext } from "./MathExpVisitor";
import { wrappedWithFuncCallLog } from "./proxyHelper";

// https://astexplorer.net/
const code = `
res = inp <=2
`;

const res = swc.parseSync(code);
const ins = wrappedWithFuncCallLog(new MathExpVisitor());
const ctx = new RuntimeContext();
ctx.mem = { inp: 2 };

const finalVal = ins.run(res, ctx);
console.log({
  ctx: ctx,
});
