import * as swc from "@swc/core";
import { MathExpVisitor } from "./MathExpVisitor";

// https://astexplorer.net/
const code = `
res = 1 + (3 * 5)**2
res1 = res + 1
`;

const res = swc.parseSync(code);
const ins = new MathExpVisitor();
const finalVal = ins.visitProgram(res);

console.log({
  ctx: ins.ctx,
});
