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
  MemberExpression,
  Module,
  NumericLiteral,
  ObjectExpression,
  PropertyName,
  StringLiteral,
  UnaryExpression,
} from "@swc/core/types";
import Visitor from "@swc/core/Visitor";
import {
  Op,
  ParamBRANCH,
  EOPS,
  ParamFUNCDECLARE,
  ParamUEXP,
  ParamBEXP,
  ParamSVAL_ObjectKV,
  ParamMEXP,
  ParamSVAL,
} from "./type.aot";

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

  private _optimizeMEXP2DotString(op: Op) {
    if (op.op !== EOPS.MEXP) {
      switch (op.op) {
        case EOPS.SVAL:
          const p = op.params as ParamSVAL;
          if (p.type === "variable") return p.v;

        default:
          throw new CompilerError(
            `optimizeMEXPToString can not resolve support ${op}`,
            {
              ctx: this,
            }
          );
      }
    }
    const p = op.params as ParamMEXP;

    return `${this._optimizeMEXP2DotString(p.obj)}.${p.path}`;
  }

  private _optimizeOp(inp: Op): Op {
    if (inp.op === EOPS.MEXP) {
      const variableName = this._optimizeMEXP2DotString(inp);
      return new Op(EOPS.SVAL, {
        type: "variable",
        v: variableName,
      } as ParamSVAL);
    }
    return inp;
  }

  captureLeftExpAsPath(visitFun: Function): string {
    let lop = this.captureOp(visitFun);
    if (lop.op !== EOPS.MEXP)
      throw new CompilerError(
        `captureLeftExpAsPath expected MEXP op. got ${lop.op}`,
        {
          ctx: this,
        }
      );
    return this._optimizeMEXP2DotString(lop);
  }

  captureRightExp(visitFun: Function) {
    let rop = this.captureOp(visitFun);
    return this._optimizeOp(rop);
  }

  captureArrayItmExp(visitFun: Function) {
    let ops = this.captureOps(visitFun);
    ops = ops.map(this._optimizeOp.bind(this));
    return ops;
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
    const cond = this.ctx.captureRightExp(() => {
      this.visitExpression(n.test);
    });

    const trueBranch = this.ctx.captureArrayItmExp(() => {
      this.visitExpression(n.consequent);
    });

    const falseBranch = this.ctx.captureArrayItmExp(() => {
      this.visitExpression(n.alternate);
    });

    const param: ParamBRANCH = {
      isExp: true,
      cond,
      trueBranch,
      falseBranch,
    };

    this.ctx.ops.push(new Op(EOPS.BRANCH, param));
    return n;
  }

  visitIfStatement(n: IfStatement) {
    const cond = this.ctx.captureRightExp(() => {
      this.visitExpression(n.test);
    });

    const trueBranch = this.ctx.captureArrayItmExp(() => {
      this.visitStatement(n.consequent);
    });

    const falseBranch = this.ctx.captureArrayItmExp(() => {
      this.visitOptionalStatement(n.alternate);
    });

    const param: ParamBRANCH = {
      isExp: false,
      cond,
      trueBranch,
      falseBranch,
    };

    this.ctx.ops.push(new Op(EOPS.BRANCH, param));
    return n;
  }

  // object member
  visitMemberExpression(n: MemberExpression): MemberExpression {
    const obj = this.ctx.captureOp(() => {
      this.visitExpression(n.object);
    });

    let path;
    switch (n.property.type) {
      case "Identifier":
        {
          path = n.property.value;
        }
        break;
      default:
        throw new CompilerError(
          `missing implement MemberExpression prop ${n.property.type}`,
          {
            ctx: this.ctx,
          }
        );
    }

    const p: ParamMEXP = {
      obj,
      path,
    };
    this.ctx.ops.push(new Op(EOPS.MEXP, p));
    return n;
  }

  // Function
  // visitFunctionDeclaration(decl: FunctionDeclaration): Declaration {
  //   const funcName = decl.identifier.value;

  //   const bodyOs = this.ctx.captureOps(() => {
  //     this.visitBlockStatement(decl.body);
  //   });
  //   const params: any = decl.params.map((itm) => {
  //     switch (itm.pat.type) {
  //       case "Identifier":
  //         return itm.pat.value;
  //       default:
  //         throw new Error("unknown function declare param");
  //     }
  //   });

  //   const p: ParamFUNCDECLARE = {
  //     name: funcName,
  //     params,
  //     body: bodyOs,
  //   };
  //   const op = new Op(EOPS.FUNCDECLARE, p);
  //   this.ctx.ops.push(op);

  //   return decl;
  // }

  // --------------
  // assignment
  //  =, +=, ....
  // --------------

  visitAssignmentExpression(n: AssignmentExpression) {
    const lexp = n.left as Expression;
    const perform = n.operator;

    let nextVal = this.ctx.captureRightExp(() => {
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
        const path = this.ctx.captureLeftExpAsPath(() => {
          this.visitExpression(lexp);
        });

        op = new Op(EOPS.MSAVE, {
          perform,
          path,
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
    const argOp = this.ctx.captureRightExp(() => {
      this.visitExpression(n.argument);
    });
    const p: ParamUEXP = {
      op: n.operator,
      arg: argOp,
    };
    const op = new Op(EOPS.UEXP, p);
    this.ctx.ops.push(op);
    return n;
  }

  visitBinaryExpression(n: BinaryExpression) {
    const op = n.operator;
    // can left / right be NumericLiteral / Expression / Identify
    const v1 = this.ctx.captureRightExp(() => {
      this.visitExpression(n.left);
    });
    const v2 = this.ctx.captureRightExp(() => {
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
          const expOp = this.ctx.captureRightExp(() => {
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
    const elements = this.ctx.captureArrayItmExp(() => {
      super.visitArrayExpression(n);
    });

    this.ctx.ops.push(new Op(EOPS.SVAL, { type: "array", v: elements }));

    return n;
  }
}
