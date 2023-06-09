import { describe, expect, test } from "@jest/globals";
import { Compiler } from "./tinyCompiler";

describe("tinyCompiler module", () => {
  test("pass1", () => {
    const program = `[ x y ] ( x + y ) / 2`;
    const tmp = new Compiler();
    const p1 = tmp.pass1(program);
    expect(p1).toEqual({
      op: "/",
      a: { op: "+", a: { op: "arg", n: 0 }, b: { op: "arg", n: 1 } },
      b: { op: "imm", n: 2 },
    });
    const p2 = tmp.pass2(p1);
    expect(p2).toEqual({
      op: "/",
      a: { op: "+", a: { op: "arg", n: 0 }, b: { op: "arg", n: 1 } },
      b: { op: "imm", n: 2 },
    });
  });

  test("pass2", () => {
    const program = `[ x ] x + 2*5`;
    const tmp = new Compiler();
    const p1 = tmp.pass1(program);
    expect(p1).toEqual({
      op: "+",
      a: { op: "arg", n: 0 },
      b: { op: "*", a: { op: "imm", n: 2 }, b: { op: "imm", n: 5 } },
    });

    const p2 = tmp.pass2(p1);

    expect(p2).toEqual({
      op: "+",
      a: { op: "arg", n: 0 },
      b: { op: "imm", n: 10 },
    });
  });

  test("example", () => {
    const program = `[ x y z ] ( 2*3*x + 5*y - 3*z ) / (1 + 3 + 2*2)`;
    const tmp = new Compiler();
    const p1 = tmp.pass1(program);
    expect(p1).toEqual({
      op: "/",
      a: {
        op: "-",
        a: {
          op: "+",
          a: {
            op: "*",
            a: { op: "*", a: { op: "imm", n: 2 }, b: { op: "imm", n: 3 } },
            b: { op: "arg", n: 0 },
          },
          b: { op: "*", a: { op: "imm", n: 5 }, b: { op: "arg", n: 1 } },
        },
        b: { op: "*", a: { op: "imm", n: 3 }, b: { op: "arg", n: 2 } },
      },
      b: {
        op: "+",
        a: { op: "+", a: { op: "imm", n: 1 }, b: { op: "imm", n: 3 } },
        b: { op: "*", a: { op: "imm", n: 2 }, b: { op: "imm", n: 2 } },
      },
    });

    const p2 = tmp.pass2(p1);
    expect(p2).toEqual({
      op: "/",
      a: {
        op: "-",
        a: {
          op: "+",
          a: { op: "*", a: { op: "imm", n: 6 }, b: { op: "arg", n: 0 } },
          b: { op: "*", a: { op: "imm", n: 5 }, b: { op: "arg", n: 1 } },
        },
        b: { op: "*", a: { op: "imm", n: 3 }, b: { op: "arg", n: 2 } },
      },
      b: { op: "imm", n: 8 },
    });
  });
});
