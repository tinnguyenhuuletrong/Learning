import * as swc from "@swc/core";
import { TLiteExpVisitor, RuntimeContext } from "../src/TLiteExpVisitor";

describe("TLite expression", () => {
  test("1 + (3 * 5)**2", async () => {
    const exp = `1 + (3 * 5)**2;`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteExpVisitor();

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
    const runtime = new TLiteExpVisitor();

    runtime.run(astTree, new RuntimeContext());
    expect(runtime.ctx.mem["res"]).toBe(8.5);
    expect(runtime).toMatchSnapshot();
  });

  test("res = inp > 2", async () => {
    const exp = `res = inp > 2`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteExpVisitor();
    const ctx = new RuntimeContext();
    ctx.mem["inp"] = 3;
    runtime.run(astTree, ctx);
    expect(runtime.ctx.mem["res"]).toBe(true);
    expect(runtime).toMatchSnapshot();
  });

  test("res = inp <= 2", async () => {
    const exp = `res = inp <= 2`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteExpVisitor();
    const ctx = new RuntimeContext();
    ctx.mem["inp"] = 2;
    runtime.run(astTree, ctx);
    expect(runtime.ctx.mem["res"]).toBe(true);
    expect(runtime).toMatchSnapshot();
  });

  test("res = inp > 2 && inp <= 5", async () => {
    const exp = `res = inp > 2 && inp <= 5`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteExpVisitor();
    const ctx = new RuntimeContext();
    ctx.mem["inp"] = 10;
    runtime.run(astTree, ctx);
    expect(runtime.ctx.mem["res"]).toBe(false);
    expect(runtime).toMatchSnapshot();
  });

  test("res = inp < 2 || inp > 5", async () => {
    const exp = `res = inp < 2 || inp > 5`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteExpVisitor();
    const ctx = new RuntimeContext();
    ctx.mem["inp"] = -1;
    runtime.run(astTree, ctx);
    expect(runtime.ctx.mem["res"]).toBe(true);
    expect(runtime).toMatchSnapshot();
  });

  test("res = !(+inp < 2 || +inp > 5)", async () => {
    const exp = `res = !(+inp < 2 || +inp > 5)`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteExpVisitor();
    const ctx = new RuntimeContext();
    ctx.mem["inp"] = "-1";
    runtime.run(astTree, ctx);
    expect(runtime.ctx.mem["res"]).toBe(false);
    expect(runtime).toMatchSnapshot();
  });
});

describe("TLite condition", () => {
  test("res = inp > 18 ? 'mature' : 'teen'", async () => {
    const exp = `res = inp > 18 ? 'mature' : 'teen'`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteExpVisitor();
    const ctx = new RuntimeContext();
    ctx.mem["inp"] = "22";
    runtime.run(astTree, ctx);
    expect(runtime.ctx.mem["res"]).toBe("mature");
    expect(runtime).toMatchSnapshot();
  });

  test("if (inp%2 == 0) isEven = true else isEven = false", async () => {
    const exp = `
      if (inp%2 ==0) 
        isEven = true
      else 
        isEven = false
    `;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteExpVisitor();
    const ctx = new RuntimeContext();
    ctx.mem["inp"] = "22";
    runtime.run(astTree, ctx);
    expect(runtime.ctx.mem["isEven"]).toBe(true);
    expect(runtime).toMatchSnapshot();
  });
});
