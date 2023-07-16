import { describe, expect, test } from "@jest/globals";
import { Compiler } from "./tinyCompiler";

function simulate(asm: string[], args: number[]) {
  var r0: any = undefined;
  var r1: any = undefined;
  var stack: any[] = [];
  asm.forEach(function (instruct) {
    var match: any = instruct.match(/(IM|AR)\s+(\d+)/) || [0, instruct, 0];
    var ins = match[1];
    var n = match[2] | 0;

    if (ins == "IM") {
      r0 = n;
    } else if (ins == "AR") {
      r0 = args[n];
    } else if (ins == "SW") {
      var tmp = r0;
      r0 = r1;
      r1 = tmp;
    } else if (ins == "PU") {
      stack.push(r0);
    } else if (ins == "PO") {
      r0 = stack.pop();
    } else if (ins == "AD") {
      r0 += r1;
    } else if (ins == "SU") {
      r0 -= r1;
    } else if (ins == "MU") {
      r0 *= r1;
    } else if (ins == "DI") {
      r0 /= r1;
    }
  });
  return r0;
}

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

  test("pass3", () => {
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

    const p3 = tmp.pass3(p2);
    console.log(p3);
    expect(p3).toEqual(["AR 0", "PU", "IM 10", "SW", "PO", "AD"]);

    const res = simulate(p3, [1]);
    expect(res).toEqual(11);
    console.log(res);
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

    const p3 = tmp.pass3(p2);
    // console.log(p3);

    expect(simulate(p3, [4, 0, 0])).toEqual(3);
    expect(simulate(p3, [4, 8, 0])).toEqual(8);
    expect(simulate(p3, [4, 8, 16])).toEqual(2);
  });
});
