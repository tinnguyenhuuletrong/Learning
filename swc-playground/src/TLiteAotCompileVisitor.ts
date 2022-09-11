import {
  AssignmentExpression,
  BinaryExpression,
  BooleanLiteral,
  Expression,
  KeyValueProperty,
  Module,
  NumericLiteral,
  ObjectExpression,
  Property,
  SpreadElement,
  StringLiteral,
} from "@swc/core/types";
import Visitor from "@swc/core/Visitor";
import util from "util";

export enum EOPS {
  SPUSH = "SPUSH",
  SPOP = "SPOP",
  MLOAD = "MLOAD",
  MSAVE = "MSAVE",
  BEXP = "BEXP",
}

export type ParamSPUSH = {
  type: "number" | "string" | "boolean";
  v: any;
};
export type ParamSLOAD = {
  variable: string;
};
export type ParamSPOP = {};
export type ParamBEXP = [string, Op, Op];
export type ParamMSAVE = {
  perform: string;
  path: string;
  nextVal: Op;
};
export type AnyParam =
  | ParamSPUSH
  | ParamBEXP
  | ParamSLOAD
  | ParamSPOP
  | ParamMSAVE;

export class Op {
  constructor(public op: EOPS, public params: AnyParam) {}

  toString() {
    return `${this.op} - ${util.inspect(this.params)}`;
  }
}

export class CompilerError extends Error {
  ctx?: CompilerContext = null;
  extraInfo? = null;

  constructor(
    message: string,
    { ctx, extraInfo }: { ctx: CompilerContext; extraInfo?: any }
  ) {
    super(message);
    this.name = "RuntimeError";

    this.ctx = ctx;
    this.extraInfo = extraInfo;
  }
}

export class CompilerContext {
  ops: Op[] = [];

  resolveRuntimeValue(n: Expression) {
    switch (n.type) {
      case "Identifier":
        // stack -> heap -> global
        // const res =
        //   safeGetPropFromObject(this.topStack(), n.value) ||
        //   safeGetPropFromObject(this.mem, n.value) ||
        //   safeGetPropFromObject(this.funcDb, n.value);
        // if (!res)
        //   throw new RuntimeError(`resolveRuntimeValue failed for ${n.value}`, {
        //     ctx: this,
        //   });
        return new Op(EOPS.MLOAD, { variable: n.value });

      // case "MemberExpression":
      //   const { variableName, pathName } =
      //     n._runtimeValue as RuntimeObjectExpression;
      //   return get(this.mem[variableName], pathName);

      default:
        return new Op(EOPS.SPOP, {});
    }
  }
}

export class TLiteAotCompileVisitor extends Visitor {
  ctx: CompilerContext;

  run(astCode: Module, ctx: CompilerContext) {
    this.ctx = ctx;
    const res = this.visitProgram(astCode);
    return res;
  }

  visitAssignmentExpression(n: AssignmentExpression) {
    super.visitAssignmentExpression(n);
    const lexp = n.left as Expression;
    const perform = n.operator;
    const nextVal = this.ctx.resolveRuntimeValue(n.right);

    let op;
    switch (lexp.type) {
      case "StringLiteral":
        op = new Op(EOPS.MSAVE, {
          perform,
          path: lexp.value,
          nextVal,
        });
        break;
      case "Identifier":
        op = new Op(EOPS.MSAVE, {
          perform,
          path: lexp.value,
          nextVal,
        });
        break;

      case "MemberExpression": {
        const { variableName, pathName } = (lexp as any)._runtimeValue;
        op = new Op(EOPS.MSAVE, {
          perform,
          path: `${variableName}.${pathName}`,
          nextVal,
        });
        break;
      }
      default:
        throw new CompilerError(`missing implement ${lexp.type}`, {
          ctx: this.ctx,
        });
    }
    this.ctx.ops.push(op);
    return n;
  }

  visitBinaryExpression(n: BinaryExpression) {
    super.visitBinaryExpression(n);
    const op = n.operator;
    // can left / right be NumericLiteral / Expression / Identify
    const v1 = this.ctx.resolveRuntimeValue(n.left);
    const v2 = this.ctx.resolveRuntimeValue(n.right);
    let res;
    switch (op) {
      case "+":

      case "-":

      case "*":

      case "/":
      case "%":
      case "**":

      case "===":
      case "==":

      case "!=":
      case "!==":

      case ">":
      case ">=":

      case "<":
      case "<=":

      case "&&":
      case "||":
        // res = `BEXP:${op}:${v1}:${v2}`;
        res = new Op(EOPS.BEXP, [op, v1, v2]);
        break;
      default:
        throw new CompilerError(`unknown op ${op}`, { ctx: this.ctx });
    }
    this.ctx.ops.push(res);
    return n;
  }

  visitNumericLiteral(n: NumericLiteral) {
    const v = parseFloat(n.raw);
    this.ctx.ops.push(new Op(EOPS.SPUSH, { type: "number", v }));
    return n;
  }

  visitStringLiteral(n: StringLiteral) {
    const v = n.value;
    this.ctx.ops.push(new Op(EOPS.SPUSH, { type: "string", v }));
    return n;
  }

  visitBooleanLiteral(n: BooleanLiteral) {
    const v = n.value;
    this.ctx.ops.push(new Op(EOPS.SPUSH, { type: "bool", v }));
    return n;
  }
}
