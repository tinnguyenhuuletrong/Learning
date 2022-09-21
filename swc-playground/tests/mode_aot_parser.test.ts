import * as swc from "@swc/core";
import { isArray, isFunction } from "lodash";
import {
  TLiteAotCompileVisitor,
  CompilerContext,
} from "../src/TLiteAotCompileVisitor";

describe("TLite aot compiler: expression, assignment", () => {
  test("1 + (3 * 5)**2", async () => {
    const exp = `1 + (3 * 5)**2;`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteAotCompileVisitor();

    const ctx = new CompilerContext();
    const finalVal = runtime.run(astTree, ctx);
    expect(runtime).toMatchSnapshot();
    console.log(exp);
    console.log(ctx.toString());
  });

  test("res = 'hello'", async () => {
    const exp = `
      res = 'hello'
      res = 'hi'
    `;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteAotCompileVisitor();

    const ctx = new CompilerContext();
    runtime.run(astTree, ctx);
    expect(runtime).toMatchSnapshot();
    console.log(exp);
    console.log(ctx.toString());
  });

  test("res = 1 + (3 * 5)/2", async () => {
    const exp = `res = 1 + (3 * 5)/2;`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteAotCompileVisitor();

    const ctx = new CompilerContext();
    runtime.run(astTree, ctx);
    expect(runtime).toMatchSnapshot();
    console.log(exp);
    console.log(ctx.toString());
  });

  test("res = inp > 2", async () => {
    const exp = `res = inp > 2`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteAotCompileVisitor();
    const ctx = new CompilerContext();
    runtime.run(astTree, ctx);
    expect(runtime).toMatchSnapshot();
    console.log(exp);
    console.log(ctx.toString());
  });

  test("res = inp <= 2", async () => {
    const exp = `res = inp <= 2`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteAotCompileVisitor();
    const ctx = new CompilerContext();
    runtime.run(astTree, ctx);
    expect(runtime).toMatchSnapshot();
    console.log(exp);
    console.log(ctx.toString());
  });

  test("res = inp > 2 && inp <= 5", async () => {
    const exp = `res = inp > 2 && inp <= 5`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteAotCompileVisitor();
    const ctx = new CompilerContext();
    runtime.run(astTree, ctx);
    expect(runtime).toMatchSnapshot();
    console.log(exp);
    console.log(ctx.toString());
  });

  test("res = inp < 2 || inp > 5", async () => {
    const exp = `res = inp < 2 || inp > 5`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteAotCompileVisitor();
    const ctx = new CompilerContext();
    runtime.run(astTree, ctx);
    expect(runtime).toMatchSnapshot();
    console.log(exp);
    console.log(ctx.toString());
  });

  test("res = !(+inp < 2 || +inp > 5)", async () => {
    const exp = `res = !(+inp < 2 || +inp > 5)`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteAotCompileVisitor();
    const ctx = new CompilerContext();
    runtime.run(astTree, ctx);
    expect(runtime).toMatchSnapshot();
    console.log(exp);
    console.log(ctx.toString());
  });
});

describe("TLite aot compiler: array, object", () => {
  test("res = [1,2,inp > 18,'name']", async () => {
    const exp = `res = [1,2,inp > 18,'name']`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteAotCompileVisitor();
    const ctx = new CompilerContext();
    runtime.run(astTree, ctx);
    expect(runtime).toMatchSnapshot();
    console.log(exp);
    console.log(ctx.toString());
  });

  test("res = [1,2,{c:true}]", async () => {
    const exp = `res = [1,2,{c:true}]`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteAotCompileVisitor();
    const ctx = new CompilerContext();
    runtime.run(astTree, ctx);
    expect(runtime).toMatchSnapshot();
    console.log(exp);
    console.log(ctx.toString());
  });

  test("res = {b:true, i: 1, v: inp, a: [1,3], o: {nestest: {}}}", async () => {
    const exp = `res = {b:true, i: 1, v: inp, a: [1,3], o: {nestest: {}}}`;
    const astTree = await swc.parse(exp);
    const runtime = new TLiteAotCompileVisitor();
    const ctx = new CompilerContext();
    runtime.run(astTree, ctx);
    expect(runtime).toMatchSnapshot();
    console.log(exp);
    console.log(ctx.toString());
  });
});
