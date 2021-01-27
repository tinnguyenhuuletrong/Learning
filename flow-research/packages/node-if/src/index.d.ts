import { Query } from "sift";
import { IExeResult } from "@ttinflow/types";
export interface IConfig {
    condition: Query<any>;
    trueNode: string;
    falseNode: string;
}
declare const _default: {
    create: (config: IConfig) => {
        exec(context: any): Promise<IExeResult>;
    };
};
export default _default;
