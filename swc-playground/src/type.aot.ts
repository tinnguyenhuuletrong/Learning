import {
  AssignmentOperator,
  BinaryOperator,
  UnaryOperator,
} from "@swc/core/types";
import util from "util";

export enum EOPS {
  SVAL = "SVAL",
  MSAVE = "MSAVE",
  UEXP = "UEXP",
  BEXP = "BEXP",
  MEXP = "MEXP",
  BRANCH = "BRANCH",
  FUNCALL = "FUNCALL",
}
export type ParamSVAL_ObjectKV = { key: string; val: Op };
type ParamSVAL_ArrayElement = Op;

export type ParamSVAL = {
  type: "number" | "string" | "bool" | "variable" | "object" | "array";
  v:
    | number
    | string
    | boolean
    | ParamSVAL_ObjectKV[]
    | ParamSVAL_ArrayElement[];
};

export type ParamSPOP = {};
export type ParamBEXP = {
  op: BinaryOperator;
  v1: Op;
  v2: Op;
};
export type ParamUEXP = {
  op: UnaryOperator;
  arg: Op;
};
export type ParamMEXP = {
  obj: Op;
  path: string;
};
export type ParamMSAVE = {
  perform: AssignmentOperator;
  path: string;
  nextVal: Op;
};
export type ParamBRANCH = {
  isExp: boolean;
  cond: Op;
  trueBranch: Op[];
  falseBranch: Op[];
};

export type ParamFUNCALL = {
  name: string;
  args: Op[];
};
export type AnyParam =
  | ParamSVAL
  | ParamUEXP
  | ParamBEXP
  | ParamMEXP
  | ParamSPOP
  | ParamMSAVE
  | ParamFUNCALL
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
        return `${this.op} ${p.op} v1:${p.v1} v2:${p.v2}`;
      }

      case EOPS.UEXP: {
        const p = this.params as ParamUEXP;
        return `${this.op} ${p.op} (${p.arg})`;
      }

      case EOPS.BRANCH: {
        const p = this.params as ParamBRANCH;
        return `${this.op}:${p.isExp ? "exp" : ""} - \n\tif: ${
          p.cond
        } \n\ttrue: ${p.trueBranch} \n\tfalse: ${p.falseBranch}`;
      }

      case EOPS.FUNCALL: {
        const p = this.params as ParamFUNCALL;
        return `${this.op} - ${p.name} args:${p.args}`;
      }

      default:
        return `${this.op} - ${util.inspect(this.params)}`;
    }
  }
}
