import {
  ArrayExpression,
  AssignmentExpression,
  BinaryExpression,
  BooleanLiteral,
  CallExpression,
  ConditionalExpression,
  Expression,
  ExpressionStatement,
  IfStatement,
  KeyValueProperty,
  MemberExpression,
  Module,
  NumericLiteral,
  ObjectExpression,
  ParenthesisExpression,
  Property,
  RuntimeGeneric,
  RuntimeKV,
  RuntimeObjectExpression,
  SpreadElement,
  Statement,
  StringLiteral,
  UnaryExpression,
} from "@swc/core/types";
import { Visitor } from "@swc/core/Visitor";
import isFunction from "lodash/isFunction";
import get from "lodash/get";
import set from "lodash/set";

declare module "@swc/core/types" {
  type RuntimeGeneric = String | Number | Boolean | Object;
  type RuntimeKV = [RuntimeGeneric, RuntimeGeneric];
  type RuntimeObjectExpression = {
    variableName: string;
    pathName: string;
  };

  interface Node {
    _runtimeValue: RuntimeGeneric | RuntimeKV | RuntimeObjectExpression;
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
  funcDb: Record<string, Function> = {};

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

function asIdentifierPerformUpdate(
  ctx: RuntimeContext,
  exp: Expression
): [string, Function] {
  switch (exp.type) {
    case "StringLiteral":
      return [exp.value, (v: any) => (ctx.mem[exp.value] = v)];
    case "Identifier":
      return [exp.value, (v: any) => (ctx.mem[exp.value] = v)];
    case "MemberExpression": {
      const { variableName, pathName } =
        exp._runtimeValue as RuntimeObjectExpression;
      return [
        `${variableName}.${pathName}`,
        (v: any) => set(ctx.mem, `${variableName}.${pathName}`, v),
      ];
    }
    default:
      throw new Error(`missing implement ${exp.type}`);
  }
}

function resolveValue(ctx: RuntimeContext, n: Expression) {
  switch (n.type) {
    case "Identifier":
      const val = ctx.mem[n.value];
      const func = ctx.funcDb[n.value];
      const res = val || func;
      if (!res) throw new Error(`resolveRuntimeValue failed for ${n.value}`);
      return res;

    case "MemberExpression":
      const { variableName, pathName } =
        n._runtimeValue as RuntimeObjectExpression;
      return get(ctx.mem[variableName], pathName);

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
    const [varName, doUpdate] = asIdentifierPerformUpdate(
      this.ctx,
      n.left as Expression
    );
    const varVal = n.right._runtimeValue;
    doUpdate(varVal);
    this.ctx.addLog(`assign ${varName} = ${JSON.stringify(varVal)}`);
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

  // conditional

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

  // array
  visitArrayExpression(n: ArrayExpression): Expression {
    super.visitArrayExpression(n);
    n._runtimeValue = Array.from(
      n.elements.map((itm) => resolveValue(this.ctx, itm.expression))
    );

    this.ctx.addLog(`got array: ${JSON.stringify(n._runtimeValue)}`);
    return n;
  }

  // object

  visitObjectExpression(n: ObjectExpression): Expression {
    super.visitObjectExpression(n);
    n._runtimeValue = Object.fromEntries(
      n.properties.map((itm) => itm._runtimeValue as RuntimeKV)
    );

    this.ctx.addLog(`got object: ${JSON.stringify(n._runtimeValue)}`);
    return n;
  }

  visitKeyValueProperty(n: KeyValueProperty): SpreadElement | Property {
    super.visitKeyValueProperty(n);

    let key;
    let val;

    switch (n.value.type) {
      case "Identifier":
        val = this.ctx.mem[n.value.value];
        break;

      default:
        val = n.value._runtimeValue;
        break;
    }

    switch (n.key.type) {
      case "Identifier":
        key = n.key.value;
        break;
      default:
        key = n._runtimeValue;
        break;
    }

    this.ctx.addLog(`got kv pair: [${key},${val}]`);
    n._runtimeValue = [key, val];
    return n;
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
        throw new Error(`unknown member expression property type ${propType}`);
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
        throw new Error(
          `unknown member expression object type ${variableType}`
        );
    }

    n._runtimeValue = {
      variableName,
      pathName,
    };
    return n;
  }

  // function

  visitCallExpression(n: CallExpression): Expression {
    super.visitCallExpression(n);

    const calleeType = n.callee.type;
    let calleeFunc: Function;
    let callThis = {};
    let funcName;
    switch (calleeType) {
      case "Identifier":
        funcName = n.callee.value;
        calleeFunc = this.ctx.funcDb[n.callee.value];
        if (!isFunction(calleeFunc))
          throw new Error(
            `call expression error function with name ${n.callee.value} not defined`
          );
        break;

      default:
        throw new Error(`unknown call expression callee type ${calleeType}`);
    }

    const args = n.arguments.map((itm) =>
      resolveValue(this.ctx, itm.expression)
    );
    const res = calleeFunc.apply(callThis, args);

    this.ctx.addLog(
      `exec function call ${funcName}() : args ${JSON.stringify(
        args
      )} -> res ${res}`
    );
    n._runtimeValue = res;
    return n;
  }

  // basic type string, boolean, number, ...

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
