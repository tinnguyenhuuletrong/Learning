import * as swc from "@swc/core";
import { isArray, isFunction } from "lodash";
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

  test("res = inp+=2", async () => {
    const exp = `res = inp +=2`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteExpVisitor();
    const ctx = new RuntimeContext();
    ctx.mem["inp"] = 2;
    runtime.run(astTree, ctx);
    expect(runtime.ctx.mem["res"]).toBe(4);
    expect(runtime).toMatchSnapshot();
  });

  test("res = inp-=2", async () => {
    const exp = `res = inp -=2`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteExpVisitor();
    const ctx = new RuntimeContext();
    ctx.mem["inp"] = 2;
    runtime.run(astTree, ctx);
    expect(runtime.ctx.mem["res"]).toBe(0);
    expect(runtime).toMatchSnapshot();
  });

  test("res = inp*=2", async () => {
    const exp = `res = inp *=2`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteExpVisitor();
    const ctx = new RuntimeContext();
    ctx.mem["inp"] = -1;
    runtime.run(astTree, ctx);
    expect(runtime.ctx.mem["res"]).toBe(-2);
    expect(runtime).toMatchSnapshot();
  });

  test("res = inp/=2", async () => {
    const exp = `res = inp /=2`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteExpVisitor();
    const ctx = new RuntimeContext();
    ctx.mem["inp"] = 2;
    runtime.run(astTree, ctx);
    expect(runtime.ctx.mem["res"]).toBe(1);
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

describe("TLite array", () => {
  test("res = [1,2,inp > 18,'name']", async () => {
    const exp = `res = [1,2,inp > 18,'name']`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteExpVisitor();
    const ctx = new RuntimeContext();
    ctx.mem["inp"] = "22";
    runtime.run(astTree, ctx);
    expect(runtime.ctx.mem["res"]).toEqual([1, 2, true, "name"]);
    expect(runtime).toMatchSnapshot();
  });
});

describe("TLite nestest mixed object", () => {
  test("mixed obj type and dynamic props 1", async () => {
    const exp = `res = {name: "mr.A", age: inp}
    res.isMature = res.age > 18
    res.house.address = "123 street A"
    res.house.items = ["table", "tv", "air-conditioner"]
    `;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteExpVisitor();
    const ctx = new RuntimeContext();
    ctx.mem["inp"] = 22;
    runtime.run(astTree, ctx);

    expect(runtime.ctx.mem["res"]).toEqual({
      name: "mr.A",
      age: 22,
      isMature: true,
      house: {
        address: "123 street A",
        items: ["table", "tv", "air-conditioner"],
      },
    });
    expect(runtime).toMatchSnapshot();
  });
});

describe("TLite function call", () => {
  test("res = toUpper(toString(inp) + '_a')", async () => {
    const exp = `
    res = toUpper(toString(inp) + "_a")
    `;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteExpVisitor();
    const ctx = new RuntimeContext();
    ctx.mem["inp"] = 22;
    ctx.funcDb["toUpper"] = (inp) => {
      return String(inp).toUpperCase();
    };
    ctx.funcDb["toString"] = (inp) => String(inp);
    runtime.run(astTree, ctx);

    expect(runtime.ctx.mem["res"]).toEqual("22_A");
    expect(runtime).toMatchSnapshot();
  });

  test("res = res = filter([1, 2, 3, inp], isOdd)", async () => {
    const exp = `
    res = filter([1, 2, 3, inp], isOdd)
    `;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteExpVisitor();
    const ctx = new RuntimeContext();
    ctx.mem["inp"] = 21;
    ctx.funcDb["isOdd"] = (inp) => parseInt(inp) % 2 !== 0;
    ctx.funcDb["filter"] = (inp, func) => {
      if (!isFunction(func)) throw new Error("arg1 is not a function");
      if (!isArray(inp)) throw new Error("arg0 is not a array");
      return inp.filter((itm) => func(itm));
    };

    runtime.run(astTree, ctx);

    expect(runtime.ctx.mem["res"]).toEqual([1, 3, 21]);
    expect(runtime).toMatchSnapshot();
  });
});

describe("TLite arrow function call", () => {
  test("f = i => i + 1; res = f(1) * f(5)", async () => {
    const exp = `
    f = i => i + 1
    res = f(1) * f(5)
    `;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteExpVisitor();
    const ctx = new RuntimeContext();
    runtime.run(astTree, ctx);

    expect(runtime.ctx.mem["res"]).toEqual(12);
    expect(runtime).toMatchSnapshot();
  });

  test("f = i => { return i + 1}; res = f(1) * f(5)", async () => {
    const exp = `
    f = i => {
      return i + 1
    }
    res = f(1) * f(5)
    `;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteExpVisitor();
    const ctx = new RuntimeContext();
    runtime.run(astTree, ctx);

    expect(runtime.ctx.mem["res"]).toEqual(12);
    expect(runtime).toMatchSnapshot();
  });

  test("res = map([1,2,3], itm => itm ** 2)", async () => {
    const exp = `
    res = map([1,2,3], itm => itm ** 2)
    `;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteExpVisitor();
    const ctx = new RuntimeContext();
    ctx.funcDb["map"] = (inp, func) => {
      if (!isFunction(func)) throw new Error("arg1 is not a function");
      if (!isArray(inp)) throw new Error("arg0 is not a array");
      return inp.map((itm) => func(itm));
    };
    runtime.run(astTree, ctx);

    expect(runtime.ctx.mem["res"]).toEqual([1, 4, 9]);
    expect(runtime).toMatchSnapshot();
  });
});
