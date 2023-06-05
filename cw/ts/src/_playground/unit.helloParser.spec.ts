import { describe, expect, test } from "@jest/globals";
import { ASTKinds, parse } from "./helloParser";

describe("playground", () => {
  test("hello grammar parser", () => {
    let res = parse("2+3");
    console.dir(res, { depth: 10 });
    expect(res.ast?.kind).toBe(ASTKinds.sum);
    expect(res.ast?.left).toBe("2");
    expect(res.ast?.right).toBe("3");

    res = parse("a+3");
    expect(res.errs.length).not.toBe(0);
    console.dir(res, { depth: 10 });
  });
});
