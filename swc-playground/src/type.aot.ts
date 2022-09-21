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
  BRANCH = "BRANCH",
  FUNCDECLARE = "FUNCDECLARE",
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
  prop: Op;
};
export type ParamMSAVE = {
  perform: AssignmentOperator;
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
        return `${this.op} ${p.op} (${p.arg})`;
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
