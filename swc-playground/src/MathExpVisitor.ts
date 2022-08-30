import { Visitor } from "@swc/core/Visitor";
import { isNumber } from "lodash";

export class MathExpVisitor extends Visitor {
  stack = [];
  mem = {};
  _logs = [];

  visitAssignmentExpression(n) {
    super.visitAssignmentExpression(n);
    const varName = n.left.value;
    const varVal = n.right;
    this.mem[varName] = n.right;
    this._logs.push(`assign ${varName} = ${varVal}`);
    return n;
  }

  visitExpressionStatement(n) {
    super.visitExpressionStatement(n);
    return n.expression;
  }

  visitBinaryExpression(n) {
    super.visitBinaryExpression(n);
    const op = n.operator;
    // can left / right be NumericLiteral / Expression / Identify
    const v1 = isNumber(n.left) ? n.left : n.left.expression;
    const v2 = n.right;
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
        throw `unknown op ${op}`;
        break;
    }

    this._logs.push(`exec ${op} for r:${v1}, l:${v2} -> ${res}`);
    return res;
  }

  visitNumericLiteral(n) {
    const v = parseFloat(n.raw);
    this._logs.push(`got num: ${v}`);
    return v as any;
  }
}
