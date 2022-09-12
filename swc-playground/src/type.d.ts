export type * from "@swc/core/types";
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
