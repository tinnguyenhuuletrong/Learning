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
tmp = {a: {b: 'VIETNAM'}}; res = concat(inp, toUpper('hello'), tmp.a.b)
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
  ctx.mem["inp"] = -999;
  ctx.func["toUpper"] = function (inp: string) {
    return String(inp).toUpperCase();
  };
  ctx.func["concat"] = (...args) => args.join(" ");

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