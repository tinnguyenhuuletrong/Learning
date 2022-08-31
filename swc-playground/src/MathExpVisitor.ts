import {
  AssignmentExpression,
  BinaryExpression,
  Expression,
  ExpressionStatement,
  Module,
  NumericLiteral,
  ParenthesisExpression,
} from "@swc/core/types";
import { Visitor } from "@swc/core/Visitor";

declare module "@swc/core/types" {
  interface Node {
    _runtimeValue: any;
  }
  interface Fn {
    _runtimeValue: Function;
  }
}

export class RuntimeContext {
  stack = [];
  mem = {};
  _logs = [];
}

export class RuntimeError extends Error {
  ctx?: RuntimeContext = null;
  extraInfo? = null;

  constructor(
    message: string,
    { ctx, extraInfo }: { ctx: RuntimeContext; extraInfo?: any }
  ) {
    super(message);
    this.name = "RuntimeError";

    this.ctx = ctx;
    this.extraInfo = extraInfo;
  }
}

function asIdentifier(ctx: RuntimeContext, exp: Expression) {
  switch (exp.type) {
    case "StringLiteral":
      return exp.value;
    case "Identifier":
      return exp.value;
  }
}

function resolveValue(ctx: RuntimeContext, n: Expression) {
  switch (n.type) {
    case "Identifier":
      return ctx.mem[n.value];

    default:
      return n._runtimeValue;
  }
}

export class MathExpVisitor extends Visitor {
  ctx: RuntimeContext;

  constructor() {
    super();
  }

  run(astCode: Module, ctx: RuntimeContext) {
    this.ctx = ctx;
    const res = this.visitProgram(astCode);
    return res;
  }

  visitAssignmentExpression(n: AssignmentExpression) {
    super.visitAssignmentExpression(n);
    const varName = asIdentifier(this.ctx, n.left as Expression);
    const varVal = n.right._runtimeValue;
    this.ctx.mem[varName] = varVal;
    this.ctx._logs.push(`assign ${varName} = ${varVal}`);
    return n;
  }

  visitParenthesisExpression(n: ParenthesisExpression) {
    super.visitParenthesisExpression(n);
    n._runtimeValue = n.expression._runtimeValue;
    return n;
  }

  visitBinaryExpression(n: BinaryExpression) {
    super.visitBinaryExpression(n);
    const op = n.operator;
    // can left / right be NumericLiteral / Expression / Identify
    const v1 = resolveValue(this.ctx, n.left);
    const v2 = resolveValue(this.ctx, n.right);
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

      case "===":
      case "==":
        res = v1 == v2;
        break;

      case "!=":
      case "!==":
        res = v1 != v2;
        break;

      case ">":
        res = v1 > v2;
        break;
      case ">=":
        res = v1 >= v2;
        break;

      case "<":
        res = v1 < v2;
        break;
      case "<=":
        res = v1 <= v2;
        break;

      case "&&":
        res = v1 && v2;
        break;
      case "||":
        res = v1 || v2;
        break;

      default:
        throw new Error(`unknown op ${op}`);
    }
    n._runtimeValue = res;
    this.ctx._logs.push(`exec ${op} for v1:${v1}, v2:${v2} -> ${res}`);
    return n;
  }

  visitNumericLiteral(n: NumericLiteral) {
    const v = parseFloat(n.raw);
    this.ctx._logs.push(`got num: ${v}`);
    n._runtimeValue = v;
    return n;
  }
}
