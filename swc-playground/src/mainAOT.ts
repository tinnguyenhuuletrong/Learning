import * as swc from "@swc/core";
import {
  TLiteAotCompileVisitor,
  CompilerContext,
} from "./TLiteAotCompileVisitor";
import { wrappedWithFuncCallLog } from "./proxyHelper";
import { isArray, isFunction } from "lodash";
import {
  RuntimeAotContext,
  RuntimeAotError,
  TLiteAotEngine,
} from "./TLiteAotEngine";
import { Op } from "./type.aot";

// https://astexplorer.net/
const code = `
res = {}; 
res.a=1; 
res.b='hi'; 
res.c.c1.c2 = true, 
res.d = res.a /2; 
res.f=inp;
res.e=[-1, res.d, res.c.c1.c2, res.f];
`;

const ops = compile(code);
run(clone(ops));

function compile(code: string) {
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
  return ctx.ops;
}

function run(ops: Op[]) {
  const runtime = new TLiteAotEngine();
  const ctx = new RuntimeAotContext({ debugTrace: true });
  ctx.mem["inp"] = 999;
  const res = runtime.run(ops, ctx);

  console.log(res);
  console.dir(
    {
      mem: ctx.mem,
      logs: ctx._logs,
    },
    { depth: 20 }
  );
}

function clone(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
