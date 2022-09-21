import {
  EOPS,
  Op,
  ParamBEXP,
  ParamMSAVE,
  ParamSVAL,
  ParamSVAL_ObjectKV,
  ParamUEXP,
} from "./type.aot";

export class RuntimeAotError extends Error {
  ctx: any;
  constructor(message: string, { ctx }: { ctx: RuntimeAotContext }) {
    super(message);
    this.ctx = ctx;
  }
}

type RuntimeAotContextOption = {
  debugTrace: boolean;
};
export class RuntimeAotContext {
  mem = {};
  _logs = [];
  _opts: RuntimeAotContextOption;

  constructor(opts: RuntimeAotContextOption = { debugTrace: true }) {
    this._opts = opts;
  }

  addLog(inp: string) {
    if (this._opts.debugTrace) this._logs.push(inp);
  }

  memGet(k: string) {
    return this.mem[k];
  }

  memSet(k: string, v: any) {
    this.mem[k] = v;
  }
}

export class TLiteAotEngine {
  ctx: RuntimeAotContext;

  run(ops: Op[], ctx: RuntimeAotContext) {
    this.ctx = ctx;

    let finalRes;
    for (let i = 0; i < ops.length; i++) {
      const op = ops[i];
      finalRes = this._exe(op);
    }
    return finalRes;
  }

  private _exe(op: Op) {
    switch (op.op) {
      case EOPS.SVAL:
        return this._exeSVAL(op.params as ParamSVAL);

      case EOPS.BEXP:
        return this._exeBEXP(op.params as ParamBEXP);

      case EOPS.MSAVE:
        return this._exeMSAVE(op.params as ParamMSAVE);

      case EOPS.UEXP:
        return this._exeUEXP(op.params as ParamUEXP);

      default:
        throw new RuntimeAotError(`unknown op ${op.op}`, { ctx: this.ctx });
    }
  }

  private _exeUEXP(p: ParamUEXP) {
    const uOp = p.op;
    const v = this._exe(p.arg);

    let res;
    switch (uOp) {
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
        throw new RuntimeAotError(`UEXP: unknown op ${uOp}`, {
          ctx: this.ctx,
        });
    }
    this.ctx.addLog(`resolve BEXP ${uOp} v:${v} - ${res}`);
    return res;
  }

  private _exeMSAVE(p: ParamMSAVE) {
    const op = p.perform;
    const path = p.path;
    let res;
    let nextVal = this._exe(p.nextVal);
    const currentVal = this.ctx.memGet(path);

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
        throw new RuntimeAotError(`MSAVE: unknown op ${op}`, {
          ctx: this.ctx,
        });
    }

    this.ctx.memSet(path, res);
    this.ctx.addLog(`do ${p.path} ${p.perform} ${res}`);
    return res;
  }

  private _exeSVAL(p: ParamSVAL) {
    let res: any = undefined;
    let log = "";
    switch (p.type) {
      case "string":
        res = String(p.v);
        log = `resolve value type ${p.type} - ${res}`;
        break;

      case "number":
        res = parseFloat(p.v as any);
        log = `resolve value type ${p.type} - ${res}`;
        break;

      case "bool":
        res = !!p.v;
        log = `resolve value type ${p.type} - ${res}`;
        break;

      case "variable": {
        const tmp = p.v as "string";
        res = this.ctx.mem[tmp];
        log = `resolve value type ${p.type}:${tmp} - ${res}`;
        break;
      }

      case "array": {
        const tmp = p.v as Op[];
        res = tmp.map((itm) => this._exe(itm));
        log = `resolve value type ${p.type} - ${res}`;
        break;
      }

      case "object": {
        const tmp = p.v as ParamSVAL_ObjectKV[];
        res = Object.fromEntries(
          tmp.map((itm) => [itm.key, this._exe(itm.val)])
        );
        log = `resolve value type ${p.type} - ${res}`;
        break;
      }

      default:
        throw new RuntimeAotError(`SVAL: unknown type ${p.type}`, {
          ctx: this.ctx,
        });
    }
    this.ctx.addLog(log);
    return res;
  }

  private _exeBEXP(p: ParamBEXP) {
    const bOp = p.op;
    const v1 = this._exe(p.v1);
    const v2 = this._exe(p.v2);

    let res;
    switch (bOp) {
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
        throw new RuntimeAotError(`BEXP: unknown op ${bOp}`, { ctx: this.ctx });
    }
    this.ctx.addLog(`resolve BEXP ${bOp} v1:${v1} v2:${v2} - ${res}`);
    return res;
  }
}
