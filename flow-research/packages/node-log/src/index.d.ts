import { IExeResult } from "@ttinflow/types";
export interface IConfig {
    label: string;
    nextNode: string;
}
declare const _default: {
    create: (config: IConfig) => {
        exec(context: any): Promise<IExeResult>;
    };
};
export default _default;
