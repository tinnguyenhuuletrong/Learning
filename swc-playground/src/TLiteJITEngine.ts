import type * as T from "./type";
import {
  ArrayExpression,
  ArrowFunctionExpression,
  AssignmentExpression,
  BinaryExpression,
  BlockStatement,
  BooleanLiteral,
  CallExpression,
  ConditionalExpression,
  Declaration,
  Expression,
  ExpressionStatement,
  FunctionDeclaration,
  IfStatement,
  KeyValueProperty,
  MemberExpression,
  Module,
  NumericLiteral,
  ObjectExpression,
  Param,
  ParenthesisExpression,
  Pattern,
  Property,
  ReturnStatement,
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
import cloneDeep from "lodash/cloneDeep";

type RuntimeContextOption = {
  debugTrace: boolean;
};

function safeGetPropFromObject(obj: Object, k: string) {
  const keys = Object.keys(obj);
  if (!keys.includes(k)) return undefined;
  return obj[k];
}

class BlockReturnInt extends Error {
  constructor(message, public value) {
    super(message);
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

export class RuntimeContext {
  stack = [];
  mem = {};
  _logs = [];
  funcDb: Record<string, Function> = {};

  private static EMPTY_OBJ = Object.freeze({});
  private _opts: RuntimeContextOption;

  constructor(opts: RuntimeContextOption = { debugTrace: true }) {
    this._opts = opts;
  }

  addLog(inp: string) {
    if (this._opts.debugTrace) this._logs.push(inp);
  }

  pushStackFuncCall(params: Pattern[], args: any[]) {
    const isEnoughParam = params.length === args.length;
    if (!isEnoughParam)
      throw new RuntimeError("not enough params", { ctx: this });

    const kvPairs = [];
    for (let i = 0; i < params.length; i++) {
      const p = params[i];
      switch (p.type) {
        case "Identifier":
          kvPairs.push([p.value, args[i]]);
          break;

        default:
          throw new RuntimeError(`pushStack unknown param type ${p.type}`, {
            ctx: this,
          });
      }
    }
    this.stack.push(Object.fromEntries(kvPairs));
    this.addLog(`push stack ${JSON.stringify(this.topStack())}`);
  }

  topStack() {
    return this.stack[this.stack.length - 1] || RuntimeContext.EMPTY_OBJ;
  }

  popStack() {
    this.addLog(`pop stack`);
    this.stack.pop();
  }

  activeMemArea() {
    return this.stack[0] || this.mem;
  }

  resolveRuntimeValue(n: Expression) {
    switch (n.type) {
      case "Identifier":
        // stack -> heap -> global
        const res =
          safeGetPropFromObject(this.topStack(), n.value) ||
          safeGetPropFromObject(this.mem, n.value) ||
          safeGetPropFromObject(this.funcDb, n.value);
        if (!res)
          throw new RuntimeError(`resolveRuntimeValue failed for ${n.value}`, {
            ctx: this,
          });
        return res;

      case "MemberExpression":
        const { variableName, pathName } =
          n._runtimeValue as RuntimeObjectExpression;
        return get(this.mem[variableName], pathName);

      default:
        return n._runtimeValue;
    }
  }

  performUpdateVariable(exp: Expression): [string, any, Function] {
    const memArea = this.activeMemArea();

    switch (exp.type) {
      case "StringLiteral":
        return [
          exp.value,
          memArea[exp.value],
          (v: any) => (memArea[exp.value] = v),
        ];
      case "Identifier":
        return [
          exp.value,
          memArea[exp.value],
          (v: any) => (memArea[exp.value] = v),
        ];
      case "MemberExpression": {
        const { variableName, pathName } =
          exp._runtimeValue as RuntimeObjectExpression;
        return [
          `${variableName}.${pathName}`,
          get(memArea, `${variableName}.${pathName}`),
          (v: any) => set(memArea, `${variableName}.${pathName}`, v),
        ];
      }
      default:
        throw new RuntimeError(`missing implement ${exp.type}`, { ctx: this });
    }
  }

  registerFunc(name, funcHandler: Function) {
    const memArea = this.activeMemArea();
    memArea[name] = funcHandler;
  }
}

export class TLiteJITEngine extends Visitor {
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
    const [varName, currentVal, doUpdate] = this.ctx.performUpdateVariable(
      n.left as Expression
    );
    const nextVal = this.ctx.resolveRuntimeValue(n.right);
    let res;
    const op = n.operator;
    switch (op) {
      case "=":
        res = nextVal;
        break;
      case "+=":
        res = currentVal + nextVal;
        break;
      case "-=":
        res = currentVal - +nextVal;
        break;
      case "*=":
        res = currentVal * +nextVal;
        break;
      case "/=":
        res = currentVal / +nextVal;
        break;

      default:
        throw new RuntimeError(`AssignmentExpression: unknown op ${op}`, {
          ctx: this.ctx,
        });
    }
    doUpdate(res);
    n._runtimeValue = res;

    this.ctx.addLog(`assign ${varName} ${op} ${JSON.stringify(nextVal)}`);
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
    const v = this.ctx.resolveRuntimeValue(n.argument);
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
        throw new RuntimeError(`UnaryExpression: unknown op ${op}`, {
          ctx: this.ctx,
        });
    }

    n._runtimeValue = res;
    this.ctx.addLog(`exec ${op} for v:${v} -> ${res}`);
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
        throw new RuntimeError(`unknown op ${op}`, { ctx: this.ctx });
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
      n.elements.map((itm) => this.ctx.resolveRuntimeValue(itm.expression))
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
        throw new RuntimeError(
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
        throw new RuntimeError(
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

  // function call
  visitCallExpression(n: CallExpression): Expression {
    super.visitCallExpression(n);

    const calleeType = n.callee.type;
    let calleeFunc: Function;
    let callThis = {};
    let funcName;
    switch (calleeType) {
      case "Identifier":
        funcName = n.callee.value;
        calleeFunc = this.ctx.resolveRuntimeValue(n.callee);
        if (!isFunction(calleeFunc))
          throw new RuntimeError(
            `call expression error function with name ${n.callee.value} not defined`,
            { ctx: this.ctx }
          );
        break;

      default:
        throw new RuntimeError(
          `unknown call expression callee type ${calleeType}`,
          { ctx: this.ctx }
        );
    }

    const args = n.arguments.map((itm) =>
      this.ctx.resolveRuntimeValue(itm.expression)
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

  // function declaration
  visitFunctionDeclaration(decl: FunctionDeclaration): Declaration {
    const funcName = decl.identifier.value;
    const body = decl.body;

    const funcHandler = (...args) => {
      this.ctx.pushStackFuncCall(
        decl.params.map((itm) => itm.pat),
        args
      );
      const bodyRet = this.visitBlockStatement(body);
      this.ctx.popStack();
      return bodyRet._runtimeValue;
    };

    this.ctx.registerFunc(funcName, funcHandler);
    this.ctx.addLog(`got decl function ${funcName}`);

    return decl;
  }

  // arrow function
  visitArrowFunctionExpression(e: ArrowFunctionExpression): Expression {
    // const body = cloneDeep(e.body);
    const body = e.body;
    const funcHandler = (...args) => {
      this.ctx.pushStackFuncCall(e.params, args);
      const bodyRet = this.visitArrowBody(body);
      this.ctx.popStack();
      return bodyRet._runtimeValue;
    };

    this.ctx.addLog(`got arrow function`);
    e._runtimeValue = funcHandler;
    return e;
  }

  visitReturnStatement(stmt: ReturnStatement): Statement {
    super.visitReturnStatement(stmt);
    stmt._runtimeValue = this.ctx.resolveRuntimeValue(stmt.argument);
    this.ctx.addLog(`got returnStatement ${stmt._runtimeValue}`);
    if (stmt._runtimeValue)
      throw new BlockReturnInt("got return", stmt._runtimeValue);
    return stmt;
  }

  // block stms
  visitBlockStatement(block: BlockStatement): BlockStatement {
    let earlyReturnVal;
    try {
      super.visitBlockStatement(block);
    } catch (error) {
      if (error instanceof BlockReturnInt) {
        earlyReturnVal = error.value;
      } else throw error;
    }

    block._runtimeValue = earlyReturnVal;
    this.ctx.addLog(`got block return: ${block._runtimeValue}`);

    return block;
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
