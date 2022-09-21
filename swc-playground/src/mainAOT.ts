import * as swc from "@swc/core";
import {
  TLiteAotCompileVisitor,
  CompilerContext,
} from "./TLiteAotCompileVisitor";
import { wrappedWithFuncCallLog } from "./proxyHelper";
import { isArray, isFunction } from "lodash";

// https://astexplorer.net/
const code = `
res = {name: "a"}
res.age = 10
`;

const res = swc.parseSync(code);
const ins = wrappedWithFuncCallLog(new TLiteAotCompileVisitor());
const ctx = new CompilerContext();

const finalVal = ins.run(res, ctx);
console.dir(
  {
    ctx: ctx,
  },
  { depth: 20 }
);

console.log(ctx.toString());
console.log(code);
