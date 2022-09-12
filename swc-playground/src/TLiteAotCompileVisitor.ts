import type * as T from "./type";
import {
  AssignmentExpression,
  BinaryExpression,
  BooleanLiteral,
  Expression,
  KeyValueProperty,
  MemberExpression,
  Module,
  NumericLiteral,
  ObjectExpression,
  Property,
  RuntimeKV,
  RuntimeObjectExpression,
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
export type ParamMLOAD = {
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
  | ParamMLOAD
  | ParamSPOP
  | ParamMSAVE;

export class Op {
  constructor(public op: EOPS, public params: AnyParam) {}

  toString() {
    switch (this.op) {
      case EOPS.SPUSH: {
        const p = this.params as ParamSPUSH;
        return `${this.op} - ${p.type} ${p.v}`;
      }

      case EOPS.SPOP: {
        const p = this.params as ParamSPOP;
        return `${this.op}`;
      }

      case EOPS.MLOAD: {
        const p = this.params as ParamMLOAD;
        return `${this.op} - ${p.variable}`;
      }

      case EOPS.MSAVE: {
        const p = this.params as ParamMSAVE;
        return `${this.op} - ${p.path} ${p.perform} {${p.nextVal.toString()}}`;
      }

      case EOPS.BEXP: {
        const p = this.params as ParamBEXP;
        return `${this.op} - ${p[0]} {${p[1].toString()}} {${p[2].toString()}}`;
      }

      default:
        return `${this.op} - ${util.inspect(this.params)}`;
    }
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
    this.name = "CompilerError";

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

      case "MemberExpression":
        const { variableName, pathName } =
          n._runtimeValue as RuntimeObjectExpression;
        return new Op(EOPS.MLOAD, { variable: `${variableName}.${pathName}` });

      default:
        return new Op(EOPS.SPOP, {});
    }
  }

  toString() {
    return this.ops.map((itm) => itm.toString()).join("\n");
  }
}

export class TLiteAotCompileVisitor extends Visitor {
  ctx: CompilerContext;

  run(astCode: Module, ctx: CompilerContext) {
    this.ctx = ctx;
    const res = this.visitProgram(astCode);
    return res;
  }

  // object member
  visitMemberExpression(n: MemberExpression): MemberExpression {
    super.visitMemberExpression(n);

    const propType = n.property.type;
    let pathName;
    switch (propType) {
      case "Identifier":
        pathName = n.property.value;
        break;

      default:
        throw new CompilerError(
          `unknown member expression property type ${propType}`,
          { ctx: this.ctx }
        );
    }

    const variableType = n.object.type;
    let variableName;
    switch (variableType) {
      case "Identifier":
        variableName = n.object.value;
        break;
      case "MemberExpression":
        const parent = n.object._runtimeValue as RuntimeObjectExpression;
        variableName = `${parent.variableName}.${parent.pathName}`;
        break;

      default:
        throw new CompilerError(
          `unknown member expression object type ${variableType}`,
          { ctx: this.ctx }
        );
    }

    n._runtimeValue = {
      variableName,
      pathName,
    };
    return n;
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

  // object
  visitObjectExpression(n: ObjectExpression): Expression {
    super.visitObjectExpression(n);
    n._runtimeValue = n.properties.map((itm) => new Op(EOPS.SPOP, {}));
    this.ctx.ops.push(
      new Op(EOPS.SPUSH, { type: "object", v: n._runtimeValue })
    );
    return n;
  }

  visitKeyValueProperty(n: KeyValueProperty): SpreadElement | Property {
    super.visitKeyValueProperty(n);

    let key;
    let val;

    switch (n.value.type) {
      case "Identifier":
        val = new Op(EOPS.MLOAD, { variable: n.value.value });
        break;

      default:
        val = new Op(EOPS.SPOP, {});
        break;
    }

    switch (n.key.type) {
      case "Identifier":
        key = n.key.value;
        break;
    }

    this.ctx.ops.push(new Op(EOPS.SPUSH, { type: "kv", v: [key, val] }));
    return n;
  }
}
