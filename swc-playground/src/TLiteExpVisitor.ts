import {
  AssignmentExpression,
  BinaryExpression,
  BooleanLiteral,
  ConditionalExpression,
  Expression,
  ExpressionStatement,
  IfStatement,
  Module,
  NumericLiteral,
  ParenthesisExpression,
  Statement,
  StringLiteral,
  UnaryExpression,
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

type RuntimeContextOption = {
  debugTrace: boolean;
};

export class RuntimeContext {
  stack = [];
  mem = {};
  _logs = [];

  private _opts: RuntimeContextOption;

  constructor(opts: RuntimeContextOption = { debugTrace: true }) {
    this._opts = opts;
  }

  addLog(inp: string) {
    if (this._opts.debugTrace) this._logs.push(inp);
  }
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

export class TLiteExpVisitor extends Visitor {
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
    this.ctx.addLog(`assign ${varName} = ${varVal}`);
    return n;
  }

  visitParenthesisExpression(n: ParenthesisExpression) {
    super.visitParenthesisExpression(n);
    n._runtimeValue = n.expression._runtimeValue;
    return n;
  }

  visitUnaryExpression(n: UnaryExpression): Expression {
    super.visitUnaryExpression(n);

    const op = n.operator;
    const v = resolveValue(this.ctx, n.argument);
    let res;
    switch (op) {
      case "!":
        res = !v;
        break;
      case "+":
        res = +v;
        break;
      case "-":
        res = -v;
        break;
      case "~":
        res = ~v;
        break;

      default:
        throw new Error(`UnaryExpression: unknown op ${op}`);
    }

    n._runtimeValue = res;
    this.ctx.addLog(`exec ${op} for v:${v} -> ${res}`);
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
    this.ctx.addLog(`exec ${op} for v1:${v1}, v2:${v2} -> ${res}`);
    return n;
  }

  visitConditionalExpression(n: ConditionalExpression): Expression {
    this.ctx.addLog(`exec if_branch_expression test`);
    n.test = this.visitExpression(n.test);
    const condVal = n.test._runtimeValue;
    let res;

    if (condVal) {
      n.consequent = this.visitExpression(n.consequent);
      res = n.consequent._runtimeValue;
    } else {
      n.alternate = this.visitExpression(n.alternate);
      res = n.alternate._runtimeValue;
    }

    n._runtimeValue = res;
    this.ctx.addLog(`exec if_branch_expression: ${condVal} -> ${res}`);
    return n;
  }

  visitIfStatement(n: IfStatement) {
    this.ctx.addLog(`exec if_branch test`);
    n.test = this.visitExpression(n.test);
    const condVal = n.test._runtimeValue;

    if (condVal) {
      n.consequent = this.visitStatement(n.consequent);
    } else {
      n.alternate = this.visitOptionalStatement(n.alternate);
    }

    this.ctx.addLog(`exec if_branch: ${condVal}`);
    return n;
  }

  visitNumericLiteral(n: NumericLiteral) {
    const v = parseFloat(n.raw);
    this.ctx.addLog(`got num: ${v}`);
    n._runtimeValue = v;
    return n;
  }

  visitStringLiteral(n: StringLiteral) {
    const v = n.value;
    this.ctx.addLog(`got str: ${v}`);
    n._runtimeValue = v;
    return n;
  }

  visitBooleanLiteral(n: BooleanLiteral) {
    const v = n.value;
    this.ctx.addLog(`got bool: ${v}`);
    n._runtimeValue = v;
    return n;
  }
}
