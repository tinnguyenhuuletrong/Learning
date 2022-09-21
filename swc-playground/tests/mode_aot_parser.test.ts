import * as swc from "@swc/core";
import { isArray, isFunction } from "lodash";
import {
  TLiteAotCompileVisitor,
  CompilerContext,
} from "../src/TLiteAotCompileVisitor";
import { TLiteAotEngine, RuntimeAotContext } from "../src/TLiteAotEngine";
import { Op } from "../src/type.aot";

function run(ops: Op[], { mem = {} }: { mem: any }) {
  const runtime = new TLiteAotEngine();
  const ctx = new RuntimeAotContext({ debugTrace: true });
  ctx.mem = mem;
  const res = runtime.run(ops, ctx);

  return { ctx, res };
}

describe("TLite aot compiler: expression, assignment", () => {
  test("1 + (3 * 5)**2", async () => {
    const exp = `1 + (3 * 5)**2;`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteAotCompileVisitor();

    const ctx = new CompilerContext();
    const finalVal = runtime.run(astTree, ctx);
    expect(runtime).toMatchSnapshot();
    console.log(exp);
    console.log(ctx.toString());

    const { res, ctx: rtCtx } = run(ctx.ops, { mem: {} });
    expect(res).toEqual(226);
    expect(rtCtx._logs).toMatchSnapshot();
  });

  test("res = 'hello'", async () => {
    const exp = `
      res = 'hello'
      res = 'hi'
    `;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteAotCompileVisitor();

    const ctx = new CompilerContext();
    runtime.run(astTree, ctx);
    expect(runtime).toMatchSnapshot();
    console.log(exp);
    console.log(ctx.toString());

    const { res, ctx: rtCtx } = run(ctx.ops, { mem: {} });
    expect(rtCtx._logs).toMatchSnapshot();
  });

  test("res = 1 + (3 * 5)/2", async () => {
    const exp = `res = 1 + (3 * 5)/2;`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteAotCompileVisitor();

    const ctx = new CompilerContext();
    runtime.run(astTree, ctx);
    expect(runtime).toMatchSnapshot();
    console.log(exp);
    console.log(ctx.toString());

    const { res, ctx: rtCtx } = run(ctx.ops, { mem: {} });
    expect(res).toBe(8.5);
    expect(rtCtx._logs).toMatchSnapshot();
  });

  test("res = inp > 2", async () => {
    const exp = `res = inp > 2`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteAotCompileVisitor();
    const ctx = new CompilerContext();
    runtime.run(astTree, ctx);
    expect(runtime).toMatchSnapshot();
    console.log(exp);
    console.log(ctx.toString());

    const { res, ctx: rtCtx } = run(ctx.ops, { mem: { inp: 3 } });
    expect(res).toBe(true);
    expect(rtCtx._logs).toMatchSnapshot();
  });

  test("res = inp <= 2", async () => {
    const exp = `res = inp <= 2`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteAotCompileVisitor();
    const ctx = new CompilerContext();
    runtime.run(astTree, ctx);
    expect(runtime).toMatchSnapshot();
    console.log(exp);
    console.log(ctx.toString());

    const { res, ctx: rtCtx } = run(ctx.ops, { mem: { inp: 3 } });
    expect(res).toBe(false);
    expect(rtCtx._logs).toMatchSnapshot();
  });

  test("res = inp > 2 && inp <= 5", async () => {
    const exp = `res = inp > 2 && inp <= 5`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteAotCompileVisitor();
    const ctx = new CompilerContext();
    runtime.run(astTree, ctx);
    expect(runtime).toMatchSnapshot();
    console.log(exp);
    console.log(ctx.toString());

    const { res, ctx: rtCtx } = run(ctx.ops, { mem: { inp: 1 } });
    expect(res).toBe(false);
    expect(rtCtx._logs).toMatchSnapshot();
  });

  test("res = inp < 2 || inp > 5", async () => {
    const exp = `res = inp < 2 || inp > 5`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteAotCompileVisitor();
    const ctx = new CompilerContext();
    runtime.run(astTree, ctx);
    expect(runtime).toMatchSnapshot();
    console.log(exp);
    console.log(ctx.toString());

    const { res, ctx: rtCtx } = run(ctx.ops, { mem: { inp: 1 } });
    expect(res).toBe(true);
    expect(rtCtx._logs).toMatchSnapshot();
  });

  test("res = !(+inp < 2 || +inp > 5)", async () => {
    const exp = `res = !(+inp < 2 || +inp > 5)`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteAotCompileVisitor();
    const ctx = new CompilerContext();
    runtime.run(astTree, ctx);
    expect(runtime).toMatchSnapshot();
    console.log(exp);
    console.log(ctx.toString());

    const { res, ctx: rtCtx } = run(ctx.ops, { mem: { inp: "-1" } });
    expect(res).toBe(false);
    expect(rtCtx._logs).toMatchSnapshot();
  });
});

describe("TLite aot compiler: array, object", () => {
  test("res = [1,2,inp > 18,'name']", async () => {
    const exp = `res = [1,2,inp > 18,'name']`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteAotCompileVisitor();
    const ctx = new CompilerContext();
    runtime.run(astTree, ctx);
    expect(runtime).toMatchSnapshot();
    console.log(exp);
    console.log(ctx.toString());

    const { res, ctx: rtCtx } = run(ctx.ops, { mem: { inp: "30" } });
    expect(rtCtx.mem["res"]).toEqual([1, 2, true, "name"]);
    expect(rtCtx._logs).toMatchSnapshot();
  });

  test("res = [1,2,{c:true}]", async () => {
    const exp = `res = [1,2,{c:true}]`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteAotCompileVisitor();
    const ctx = new CompilerContext();
    runtime.run(astTree, ctx);
    expect(runtime).toMatchSnapshot();
    console.log(exp);
    console.log(ctx.toString());

    const { res, ctx: rtCtx } = run(ctx.ops, { mem: {} });
    expect(rtCtx.mem["res"]).toEqual([1, 2, { c: true }]);
    expect(rtCtx._logs).toMatchSnapshot();
  });

  test("res = {b:true, i: 1, v: inp, a: [1,3], o: {nestest: {}}}", async () => {
    const exp = `res = {b:true, i: 1, v: inp, a: [1,3], o: {nestest: {}}}`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteAotCompileVisitor();
    const ctx = new CompilerContext();
    runtime.run(astTree, ctx);
    expect(runtime).toMatchSnapshot();
    console.log(exp);
    console.log(ctx.toString());

    const { res, ctx: rtCtx } = run(ctx.ops, { mem: { inp: "some thing" } });
    expect(rtCtx.mem["res"]).toEqual({
      b: true,
      i: 1,
      v: "some thing",
      a: [1, 3],
      o: { nestest: {} },
    });
    expect(rtCtx._logs).toMatchSnapshot();
  });
});
