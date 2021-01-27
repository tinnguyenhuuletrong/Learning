import { IExeResult } from "@ttinflow/types";

export interface IConfig {
  label: string;
  nextNode: string;
}

export default {
  create: (config: IConfig) => {
    return {
      async exec(context: any): Promise<IExeResult> {
        console.log(`[${config.label}]`, { context });

        return {
          isSuccess: true,
          nextNode: config.nextNode,
        };
      },
    };
  },
};
