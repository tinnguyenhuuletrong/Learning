import * as swc from "@swc/core";
import { MathExpVisitor } from "../src/MathExpVisitor";

describe("Math expression", () => {
  test("1 + (3 * 5)**2", async () => {
    const exp = `1 + (3 * 5)**2;`;
    const astTree = await swc.parse(exp);
    const runtime = new MathExpVisitor();

    const finalVal = runtime.visitProgram(astTree);
    expect(finalVal.body[0]).toBe(226);
    expect(runtime).toMatchSnapshot();
  });
});
