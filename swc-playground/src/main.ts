import * as swc from "@swc/core";
import { TLiteExpVisitor, RuntimeContext } from "./TLiteExpVisitor";
import { wrappedWithFuncCallLog } from "./proxyHelper";

// https://astexplorer.net/
const code = `
if (inp %2 === 0) {
  isEven = true
} else {
  isEven = false
}
`;

const res = swc.parseSync(code);
const ins = wrappedWithFuncCallLog(new TLiteExpVisitor());
const ctx = new RuntimeContext();
ctx.mem = { inp: 2 };

const finalVal = ins.run(res, ctx);
console.log({
  ctx: ctx,
});
