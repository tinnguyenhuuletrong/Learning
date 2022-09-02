import * as swc from "@swc/core";
import { TLiteExpVisitor, RuntimeContext } from "./TLiteExpVisitor";
import { wrappedWithFuncCallLog } from "./proxyHelper";

// https://astexplorer.net/
const code = `
res = {name: "mr.A", age: inp}
res.isMature = res.age > 18
res.house.address = "123 street A"
res.house.items = ["table", "tv", "air-conditioner"]
`;

const res = swc.parseSync(code);
const ins = wrappedWithFuncCallLog(new TLiteExpVisitor());
const ctx = new RuntimeContext();
ctx.mem = { inp: 2 };

const finalVal = ins.run(res, ctx);
console.dir(
  {
    ctx: ctx,
  },
  { depth: 5 }
);
