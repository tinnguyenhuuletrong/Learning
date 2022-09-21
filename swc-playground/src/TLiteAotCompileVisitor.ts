import type * as T from "./type";
import {
  ArrayExpression,
  AssignmentExpression,
  BinaryExpression,
  BooleanLiteral,
  ConditionalExpression,
  Declaration,
  Expression,
  FunctionDeclaration,
  Identifier,
  IfStatement,
  KeyValueProperty,
  MemberExpression,
  Module,
  NumericLiteral,
  ObjectExpression,
  Property,
  PropertyName,
  RuntimeKV,
  RuntimeObjectExpression,
  SpreadElement,
  StringLiteral,
  UnaryExpression,
} from "@swc/core/types";
import Visitor from "@swc/core/Visitor";
import util from "util";

export enum EOPS {
  SVAL = "SVAL",
  MSAVE = "MSAVE",
  UEXP = "UEXP",
  BEXP = "BEXP",
  BRANCH = "BRANCH",
  FUNCDECLARE = "FUNCDECLARE",
}

type ParamSVAL_ObjectKV = { key: string; val: Op };
type ParamSVAL_ArrayElement = Op;

export type ParamSVAL = {
  type: "number" | "string" | "boolean" | "variable" | "object" | "array";
  v:
    | number
    | string
    | boolean
    | ParamSVAL_ObjectKV[]
    | ParamSVAL_ArrayElement[];
};

export type ParamSPOP = {};
export type ParamBEXP = {
  op: string;
  v1: Op;
  v2: Op;
};
export type ParamUEXP = {
  op: string;
  args: Op[];
};
export type ParamMSAVE = {
  perform: string;
  path: string;
  nextVal: Op;
};
export type ParamBRANCH = {
  cond: Op[];
  trueBranch: Op[];
  falseBranch: Op[];
};

export type ParamFUNCDECLARE = {
  name: string;
  params: string[];
  body: Op[];
};
export type AnyParam =
  | ParamSVAL
  | ParamBEXP
  | ParamSPOP
  | ParamMSAVE
  | ParamFUNCDECLARE
  | ParamBRANCH;

export class Op {
  constructor(public op: EOPS, public params: AnyParam) {}

  toString() {
    switch (this.op) {
      case EOPS.SVAL: {
        const p = this.params as ParamSVAL;

        switch (p.type) {
          case "object": {
            const kv = p.v as ParamSVAL_ObjectKV[];
            return `${this.op} - ${p.type} {${kv.map(
              (itm) => `${itm.key}:${itm.val}`
            )}}`;
          }
          case "array": {
            const kv = p.v as ParamSVAL_ArrayElement[];
            return `${this.op} - ${p.type} [${p.v}]`;
          }

          default:
            return `${this.op} - ${p.type} ${p.v}`;
        }
      }

      case EOPS.MSAVE: {
        const p = this.params as ParamMSAVE;
        return `${this.op} - ${p.path} ${p.perform} ${p.nextVal.toString()}`;
      }

      case EOPS.BEXP: {
        const p = this.params as ParamBEXP;
        return `${this.op} ${p.op} \nv1:${p.v1} \nv2:${p.v2}`;
      }

      case EOPS.UEXP: {
        const p = this.params as ParamUEXP;
        return `${this.op} ${p.op} (${p.args})`;
      }

      case EOPS.BRANCH: {
        const p = this.params as ParamBRANCH;
        return `${this.op} - 
        if: 
        \t${p.cond} 
        true: 
        \t${p.trueBranch}
        false:
        \t${p.falseBranch}`;
      }

      case EOPS.FUNCDECLARE: {
        const p = this.params as ParamFUNCDECLARE;
        return `${this.op} - 
        name: 
        \t${p.name} 
        params: 
        \t${p.params}
        body:
        \t${p.body}`;
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

  // resolveRuntimeValue(n: Expression) {
  //   switch (n.type) {
  //     case "MemberExpression":
  //       const { variableName, pathName } =
  //         n._runtimeValue as RuntimeObjectExpression;
  //       return new Op(EOPS.MLOAD, { variable: `${variableName}.${pathName}` });

  //     default:
  //       return new Op(EOPS.SPOP, {});
  //   }
  // }

  captureOps(visitFun: Function) {
    const beginIndex = this.ops.length - 1;
    visitFun();
    const endIndex = this.ops.length - 1;
    return this.ops.splice(beginIndex + 1, endIndex - beginIndex);
  }

  captureOp(visitFun: Function) {
    const ops = this.captureOps(visitFun);
    if (ops.length != 1) {
      throw new CompilerError(`captureOp has ${ops.length}. expected 1 op`, {
        ctx: this,
      });
    }
    return ops[0];
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

  // conditional expression
  visitConditionalExpression(n: ConditionalExpression): Expression {
    const cond = this.ctx.captureOps(() => {
      this.visitExpression(n.test);
    });

    const trueBranch = this.ctx.captureOps(() => {
      this.visitExpression(n.consequent);
    });

    const falseBranch = this.ctx.captureOps(() => {
      this.visitExpression(n.alternate);
    });

    const param: ParamBRANCH = {
      cond,
      trueBranch,
      falseBranch,
    };

    this.ctx.ops.push(new Op(EOPS.BRANCH, param));
    return n;
  }

  visitIfStatement(n: IfStatement) {
    const cond = this.ctx.captureOps(() => {
      this.visitExpression(n.test);
    });

    const trueBranch = this.ctx.captureOps(() => {
      this.visitStatement(n.consequent);
    });

    const falseBranch = this.ctx.captureOps(() => {
      this.visitOptionalStatement(n.alternate);
    });

    const param: ParamBRANCH = {
      cond,
      trueBranch,
      falseBranch,
    };

    this.ctx.ops.push(new Op(EOPS.BRANCH, param));
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

  // Function
  visitFunctionDeclaration(decl: FunctionDeclaration): Declaration {
    const funcName = decl.identifier.value;

    const bodyOs = this.ctx.captureOps(() => {
      this.visitBlockStatement(decl.body);
    });
    const params: any = decl.params.map((itm) => {
      switch (itm.pat.type) {
        case "Identifier":
          return itm.pat.value;
        default:
          throw new Error("unknown function declare param");
      }
    });

    const p: ParamFUNCDECLARE = {
      name: funcName,
      params,
      body: bodyOs,
    };
    const op = new Op(EOPS.FUNCDECLARE, p);
    this.ctx.ops.push(op);

    return decl;
  }

  // --------------
  // assignment
  //  =, +=, ....
  // --------------

  visitAssignmentExpression(n: AssignmentExpression) {
    const lexp = n.left as Expression;
    const perform = n.operator;

    const nextVal = this.ctx.captureOp(() => {
      n.right = this.visitExpression(n.right);
    });

    let op;
    switch (lexp.type) {
      case "StringLiteral":
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

  // --------------
  // expression
  //  Binary, Unary
  // --------------

  visitUnaryExpression(n: UnaryExpression): Expression {
    const argOp = this.ctx.captureOps(() => {
      this.visitExpression(n.argument);
    });
    const p: ParamUEXP = {
      op: n.operator,
      args: argOp,
    };
    const op = new Op(EOPS.UEXP, p);
    this.ctx.ops.push(op);
    return n;
  }

  visitBinaryExpression(n: BinaryExpression) {
    const op = n.operator;
    // can left / right be NumericLiteral / Expression / Identify
    const v1 = this.ctx.captureOp(() => {
      this.visitExpression(n.left);
    });
    const v2 = this.ctx.captureOp(() => {
      this.visitExpression(n.right);
    });
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
        const p: ParamBEXP = {
          op,
          v1,
          v2,
        };
        res = new Op(EOPS.BEXP, p);
        break;
      default:
        throw new CompilerError(`unknown op ${op}`, { ctx: this.ctx });
    }
    this.ctx.ops.push(res);
    return n;
  }

  // -----------------
  // Leaf node
  //  string, number, boolean, obj, arr
  // -----------------

  visitNumericLiteral(n: NumericLiteral) {
    const v = parseFloat(n.raw);
    this.ctx.ops.push(new Op(EOPS.SVAL, { type: "number", v }));
    return n;
  }

  visitStringLiteral(n: StringLiteral) {
    const v = n.value;
    this.ctx.ops.push(new Op(EOPS.SVAL, { type: "string", v }));
    return n;
  }

  visitBooleanLiteral(n: BooleanLiteral) {
    const v = n.value;
    this.ctx.ops.push(new Op(EOPS.SVAL, { type: "bool", v }));
    return n;
  }

  visitIdentifierReference(i: Identifier): Identifier {
    const v = i.value;
    this.ctx.ops.push(new Op(EOPS.SVAL, { type: "variable", v }));
    return i;
  }

  // // object
  visitObjectExpression(n: ObjectExpression): Expression {
    const properties: ParamSVAL_ObjectKV[] = [];

    const resoveKeyAsString = (p: PropertyName) => {
      switch (p.type) {
        case "NumericLiteral":
        case "Identifier":
        case "StringLiteral":
          return p.value.toString();

        default:
          throw new CompilerError(
            `Not yet support object prop key-type ${p.type}`,
            { ctx: this.ctx }
          );
      }
    };

    for (const it of n.properties) {
      switch (it.type) {
        case "KeyValueProperty":
          const expOp = this.ctx.captureOp(() => {
            this.visitExpression(it.value);
          });
          const key = resoveKeyAsString(it.key);
          properties.push({ key, val: expOp });
          break;

        default:
          throw new CompilerError(
            `Not yet support object prop type ${it.type}`,
            { ctx: this.ctx }
          );
      }
    }
    this.ctx.ops.push(new Op(EOPS.SVAL, { type: "object", v: properties }));
    return n;
  }

  visitArrayExpression(n: ArrayExpression): Expression {
    const elements = this.ctx.captureOps(() => {
      super.visitArrayExpression(n);
    });

    this.ctx.ops.push(new Op(EOPS.SVAL, { type: "array", v: elements }));

    return n;
  }
}
