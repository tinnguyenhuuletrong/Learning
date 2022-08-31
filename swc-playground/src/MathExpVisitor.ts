import {
  AssignmentExpression,
  BinaryExpression,
  Expression,
  ExpressionStatement,
  NumericLiteral,
} from "@swc/core/types";
import { Visitor } from "@swc/core/Visitor";

export class RuntimeData {
  stack = [];
  mem = {};
  _logs = [];

  _val = new WeakMap();
}

export class RuntimeError extends Error {
  ctx?: RuntimeData = null;
  extraInfo? = null;

  constructor(
    message: string,
    { ctx, extraInfo }: { ctx: RuntimeData; extraInfo?: any }
  ) {
    super(message);
    this.name = "RuntimeError";

    this.ctx = ctx;
    this.extraInfo = extraInfo;
  }
}

function asNumber(ctx: RuntimeData, exp: Expression): number {
  switch (exp.type) {
    case "NumericLiteral":
      return exp.value;
    case "Identifier":
      return ctx.mem[exp.value];
    case "ParenthesisExpression": {
      const val = ctx._val.get(exp.expression);
      if (val) return val;

      throw new RuntimeError(`asNumber failed ${exp.type}`, { ctx });
    }
    default: {
      const val = ctx._val.get(exp);
      if (val) return val;

      throw new RuntimeError(`asNumber failed ${exp.type}`, { ctx });
    }
  }
}

function asIdentifier(ctx: RuntimeData, exp: Expression) {
  switch (exp.type) {
    case "StringLiteral":
      return exp.value;
    case "Identifier":
      return exp.value;
  }
}

function asValue(ctx: RuntimeData, exp: Expression) {
  const val = ctx._val.get(exp);
  return val;
}

export class MathExpVisitor extends Visitor {
  ctx: RuntimeData;

  constructor() {
    super();
    this.ctx = new RuntimeData();
  }

  visitAssignmentExpression(n: AssignmentExpression) {
    super.visitAssignmentExpression(n);
    const varName = asIdentifier(this.ctx, n.left as Expression);
    const varVal = asValue(this.ctx, n.right);
    this.ctx.mem[varName] = varVal;
    this.ctx._logs.push(`assign ${varName} = ${varVal}`);
    return n;
  }

  visitExpressionStatement(n: ExpressionStatement) {
    super.visitExpressionStatement(n);
    this.ctx._val.set(n, n.expression);
    return n;
  }

  visitBinaryExpression(n: BinaryExpression) {
    super.visitBinaryExpression(n);
    const op = n.operator;
    // can left / right be NumericLiteral / Expression / Identify
    const v1 = asNumber(this.ctx, n.left);
    const v2 = asNumber(this.ctx, n.right);
    let res;
    switch (op) {
      case "+":
        res = v1 + v2;
        break;
      case "-":
        res = v1 - v2;
        break;
      case "*":
        res = v1 * v2;
        break;
      case "/":
        res = v1 / v2;
        break;
      case "%":
        res = v1 % v2;
        break;
      case "**":
        res = v1 ** v2;
        break;
      case "==":
        res = v1 == v2;
        break;
      default:
        throw new Error(`unknown op ${op}`);
    }
    this.ctx._val.set(n, res);
    this.ctx._logs.push(`exec ${op} for r:${v1}, l:${v2} -> ${res}`);
    return n;
  }

  visitNumericLiteral(n: NumericLiteral) {
    const v = parseFloat(n.raw);
    this.ctx._val.set(n, v);
    this.ctx._logs.push(`got num: ${v}`);
    return n;
  }
}
