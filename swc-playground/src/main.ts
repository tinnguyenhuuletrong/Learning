import * as swc from "@swc/core";
import { MathExpVisitor } from "./MathExpVisitor";

// https://astexplorer.net/
const code = `
res = 1 + (3 * 5)**2
`;

const res = swc.parseSync(code);
const ins = new MathExpVisitor();
const finalVal = ins.visitProgram(res);

console.log({
  mem: ins.mem,
  _logs: ins._logs,
});
