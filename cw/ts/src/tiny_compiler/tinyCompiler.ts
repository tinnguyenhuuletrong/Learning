import {
  ASTKinds,
  expression,
  factor,
  parse,
} from "../_playground/smallAsmParser";

// { 'op': '+', 'a': a, 'b': b }    // add subtree a to subtree b
// { 'op': '-', 'a': a, 'b': b }    // subtract subtree b from subtree a
// { 'op': '*', 'a': a, 'b': b }    // multiply subtree a by subtree b
// { 'op': '/', 'a': a, 'b': b }    // divide subtree a from subtree b
// { 'op': 'arg', 'n': n }          // reference to n-th argument, n integer
// { 'op': 'imm', 'n': n }          // immediate value n, n integer

type AnyNode = NodeExp | NodeArg | NodeImm;
type NodeExp = {
  op: "+" | "-" | "*" | "/";
  a: AnyNode;
  b: AnyNode;
};
type NodeArg = {
  op: "arg";
  n: number;
};
type NodeImm = {
  op: "imm";
  n: number;
};

export class Compiler {
  pass1(program: string): NodeExp {
    const tmp = parse(program);
    if (tmp.errs.length !== 0) throw tmp.errs;
    if (!tmp.ast?.exp) throw new Error("exp null");

    // console.dir(tmp.ast?.arg, { depth: 10 });
    // console.dir(tmp.ast?.exp, { depth: 10 });

    const doMap = (e: expression | factor) => {
      let data: any = {};
      switch (e.kind) {
        case ASTKinds.factor_1:
          data.op = "imm";
          data.n = parseInt(e.imm);
          break;

        case ASTKinds.factor_2:
          data.op = "arg";
          data.n = tmp.ast?.arg.findIndex((itm) => itm.name === e.arg);
          break;

        case ASTKinds.factor_3:
          data = doMap(e.exp);
          break;

        default:
          data.op = e.op;
          data.a = doMap(e.left);
          data.b = doMap(e.right);
          break;
      }
      return data;
    };
    return doMap(tmp.ast.exp);
  }
  pass2(pass1Tree: NodeExp) {
    const doOptimize = (b: AnyNode): [true, NodeImm] | [false, AnyNode] => {
      switch (b.op) {
        case "imm":
          return [true, { op: "imm", n: b.n }];

        case "+":
          {
            const va = doOptimize(b.a);
            const vb = doOptimize(b.b);
            if (va[0] && vb[0]) {
              return [true, { op: "imm", n: va[1].n + vb[1].n }];
            }
            if (va[0]) b.a = va[1];
            if (vb[0]) b.b = vb[1];
          }
          break;

        case "-":
          {
            const va = doOptimize(b.a);
            const vb = doOptimize(b.b);
            if (va[0] && vb[0]) {
              return [true, { op: "imm", n: va[1].n - vb[1].n }];
            }
            if (va[0]) b.a = va[1];
            if (vb[0]) b.b = vb[1];
          }
          break;

        case "*":
          {
            const va = doOptimize(b.a);
            const vb = doOptimize(b.b);
            if (va[0] && vb[0]) {
              return [true, { op: "imm", n: va[1].n * vb[1].n }];
            }
            if (va[0]) b.a = va[1];
            if (vb[0]) b.b = vb[1];
          }
          break;

        case "/":
          {
            const va = doOptimize(b.a);
            const vb = doOptimize(b.b);
            if (va[0] && vb[0]) {
              return [true, { op: "imm", n: va[1].n / vb[1].n }];
            }
            if (va[0]) b.a = va[1];
            if (vb[0]) b.b = vb[1];
          }
          break;

        default:
          break;
      }
      return [false, b];
    };

    return doOptimize(pass1Tree)[1];
  }
  pass3(program) {}

  compile(program: string) {
    return this.pass3(this.pass2(this.pass1(program)));
  }
}
