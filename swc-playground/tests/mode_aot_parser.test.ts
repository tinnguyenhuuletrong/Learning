import * as swc from "@swc/core";
import { isArray, isFunction } from "lodash";
import {
  TLiteAotCompileVisitor,
  CompilerContext,
} from "../src/TLiteAotCompileVisitor";
import { TLiteAotEngine, RuntimeAotContext } from "../src/TLiteAotEngine";
import { Op } from "../src/type.aot";

function run(ops: Op[], { mem = {}, func = {} }: { mem: any; func?: any }) {
  const runtime = new TLiteAotEngine();
  const ctx = new RuntimeAotContext({ debugTrace: true });
  ctx.mem = mem;
  ctx.func = func;

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

  test("res = {}; res.a=1; res.b='hi'; res.c.c1.c2 = true, res.d = res.a /2; res.f=inp; res.e=[-1, res.d, res.c.c1.c2, res.f];", async () => {
    const exp = `res = {}; res.a=1; res.b='hi'; res.c.c1.c2 = true, res.d = res.a /2; res.f=inp; res.e=[-1, res.d, res.c.c1.c2, res.f];`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteAotCompileVisitor();
    const ctx = new CompilerContext();
    runtime.run(astTree, ctx);
    expect(runtime).toMatchSnapshot();
    console.log(exp);
    console.log(ctx.toString());

    const { res, ctx: rtCtx } = run(ctx.ops, { mem: { inp: 999 } });
    expect(rtCtx.mem["res"]).toEqual({
      a: 1,
      b: "hi",
      c: { c1: { c2: true } },
      d: 0.5,
      f: 999,
      e: [-1, 0.5, true, 999],
    });
    expect(rtCtx._logs).toMatchSnapshot();
  });
});

describe("TLite aot compiler: condition, condition exp", () => {
  test("res = inp > 18 ? 'mature' : 'teen'", async () => {
    const exp = `res = inp > 18 ? 'mature' : 'teen'`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteAotCompileVisitor();
    const ctx = new CompilerContext();
    runtime.run(astTree, ctx);
    expect(runtime).toMatchSnapshot();
    console.log(exp);
    console.log(ctx.toString());

    const { res, ctx: rtCtx } = run(ctx.ops, { mem: { inp: 19 } });
    expect(rtCtx.mem["res"]).toEqual("mature");
    expect(rtCtx._logs).toMatchSnapshot();
  });

  test("if (inp%2 == 0) isEven = true else isEven = false'", async () => {
    const exp = `if (inp%2 == 0) {isEven = true} else {isEven = false}`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteAotCompileVisitor();
    const ctx = new CompilerContext();
    runtime.run(astTree, ctx);
    expect(runtime).toMatchSnapshot();
    console.log(exp);
    console.log(ctx.toString());

    const { res, ctx: rtCtx } = run(ctx.ops, { mem: { inp: 19 } });
    expect(rtCtx.mem["isEven"]).toEqual(false);
    expect(rtCtx._logs).toMatchSnapshot();
  });

  test("if (inp%2 == 0) {isEven = true; nextVal = inp+1} else {isEven = false; nextVal = inp-1}", async () => {
    const exp = `if (inp%2 == 0) {isEven = true; nextVal = inp+1} else {isEven = false; nextVal = inp-1}`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteAotCompileVisitor();
    const ctx = new CompilerContext();
    runtime.run(astTree, ctx);
    expect(runtime).toMatchSnapshot();
    console.log(exp);
    console.log(ctx.toString());

    const { res, ctx: rtCtx } = run(ctx.ops, { mem: { inp: 19 } });
    expect(rtCtx.mem).toEqual({
      inp: 19,
      isEven: false,
      nextVal: 18,
    });

    expect(rtCtx._logs).toMatchSnapshot();
  });
});

describe("TLite aot compiler: func call", () => {
  test("tmp = {a: {b: 'VIETNAM'}}; res = concat(inp, toUpper('hello'), tmp.a.b)", async () => {
    const exp = `tmp = {a: {b: 'VIETNAM'}}; res = concat(inp, toUpper('hello'), tmp.a.b)`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteAotCompileVisitor();
    const ctx = new CompilerContext();
    runtime.run(astTree, ctx);
    expect(runtime).toMatchSnapshot();
    console.log(exp);
    console.log(ctx.toString());

    const { res, ctx: rtCtx } = run(ctx.ops, {
      mem: { inp: "TLite" },
      func: {
        toUpper: (a) => String(a).toUpperCase(),
        concat: (...args) => args.join(" "),
      },
    });

    expect(rtCtx.mem["res"]).toEqual("TLite HELLO VIETNAM");
    expect(rtCtx._logs).toMatchSnapshot();
  });

  test("echo('hi')", async () => {
    const exp = `echo('hi')`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteAotCompileVisitor();
    const ctx = new CompilerContext();
    runtime.run(astTree, ctx);
    expect(runtime).toMatchSnapshot();
    console.log(exp);
    console.log(ctx.toString());

    const { res, ctx: rtCtx } = run(ctx.ops, {
      mem: {},
      func: {
        echo: (...args) => console.log(...["i am echo man", args]),
      },
    });

    expect(rtCtx._logs).toMatchSnapshot();
  });
});
