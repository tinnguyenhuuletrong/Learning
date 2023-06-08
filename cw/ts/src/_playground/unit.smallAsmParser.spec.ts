import { describe, expect, test } from "@jest/globals";
import { ASTKinds, parse } from "./smallAsmParser";

describe("playground", () => {
  test("test 4", () => {
    let res = parse(" [ x y z ] ( 2*3*x + 5*y - 3*z ) / (1 + 3 + 2*2)");
    console.dir(res, { depth: 10 });
    expect(res.errs.length).toBe(0);
  });
  test("test 3", () => {
    let res = parse(" [ x y ] ( x + y ) / 2");
    console.dir(res, { depth: 10 });
    expect(res.errs.length).toBe(0);
  });

  test("test 2", () => {
    let res = parse("[ a b ] a*a + b*b");
    console.dir(res, { depth: 10 });
    expect(res.errs.length).toBe(0);
  });

  test("test 1", () => {
    let res = parse("[ a ] 10 + 20");
    console.dir(res, { depth: 10 });
    expect(res.errs.length).toBe(0);
  });
});
