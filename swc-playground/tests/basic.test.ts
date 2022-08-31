import * as swc from "@swc/core";
import { MathExpVisitor, RuntimeContext } from "../src/MathExpVisitor";

describe("Math expression", () => {
  test("1 + (3 * 5)**2", async () => {
    const exp = `1 + (3 * 5)**2;`;
    const astTree = await swc.parse(exp);
    const runtime = new MathExpVisitor();

    const finalVal = runtime.run(astTree, new RuntimeContext());
    expect(
      finalVal.body[0].type === "ExpressionStatement" &&
        finalVal.body[0].expression._runtimeValue === 226
    ).toBe(true);
    expect(runtime).toMatchSnapshot();
  });

  test("res = 1 + (3 * 5)**2", async () => {
    const exp = `res = 1 + (3 * 5)/2;`;
    const astTree = await swc.parse(exp);
    const runtime = new MathExpVisitor();

    runtime.run(astTree, new RuntimeContext());
    expect(runtime.ctx.mem["res"]).toBe(8.5);
    expect(runtime).toMatchSnapshot();
  });

  test("res = inp > 2", async () => {
    const exp = `res = inp > 2`;
    const astTree = await swc.parse(exp);
    const runtime = new MathExpVisitor();
    const ctx = new RuntimeContext();
    ctx.mem["inp"] = 3;
    runtime.run(astTree, ctx);
    expect(runtime.ctx.mem["res"]).toBe(true);
    expect(runtime).toMatchSnapshot();
  });

  test("res = inp <= 2", async () => {
    const exp = `res = inp <= 2`;
    const astTree = await swc.parse(exp);
    const runtime = new MathExpVisitor();
    const ctx = new RuntimeContext();
    ctx.mem["inp"] = 2;
    runtime.run(astTree, ctx);
    expect(runtime.ctx.mem["res"]).toBe(true);
    expect(runtime).toMatchSnapshot();
  });

  test("res = inp > 2 && inp <= 5", async () => {
    const exp = `res = inp > 2 && inp <= 5`;
    const astTree = await swc.parse(exp);
    const runtime = new MathExpVisitor();
    const ctx = new RuntimeContext();
    ctx.mem["inp"] = 10;
    runtime.run(astTree, ctx);
    expect(runtime.ctx.mem["res"]).toBe(false);
    expect(runtime).toMatchSnapshot();
  });

  test("res = inp < 2 || inp > 5", async () => {
    const exp = `res = inp < 2 || inp > 5`;
    const astTree = await swc.parse(exp);
    const runtime = new MathExpVisitor();
    const ctx = new RuntimeContext();
    ctx.mem["inp"] = -1;
    runtime.run(astTree, ctx);
    expect(runtime.ctx.mem["res"]).toBe(true);
    expect(runtime).toMatchSnapshot();
  });
});
