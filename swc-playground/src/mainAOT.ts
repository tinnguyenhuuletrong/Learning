import * as swc from "@swc/core";
import {
  TLiteAotCompileVisitor,
  CompilerContext,
} from "./TLiteAotCompileVisitor";
import { wrappedWithFuncCallLog } from "./proxyHelper";
import { isArray, isFunction } from "lodash";

// https://astexplorer.net/
const code = `
function add(a,b) {
  return a + b
}
res = add(1,2) + add(3,4)
`;

const res = swc.parseSync(code);
const ins = wrappedWithFuncCallLog(new TLiteAotCompileVisitor());
const ctx = new CompilerContext();

const finalVal = ins.run(res, ctx);
console.dir(
  {
    ctx: ctx,
  },
  { depth: 10 }
);

console.log(ctx.toString());
