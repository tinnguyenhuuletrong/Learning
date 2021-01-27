import sift, { Query } from "sift";
import { IExeResult } from "@ttinflow/types";

export interface IConfig {
  condition: Query<any>;
  trueNode: string;
  falseNode: string;
}

export default {
  create: (config: IConfig) => {
    return {
      async exec(context: any): Promise<IExeResult> {
        const isMatch = sift(config.condition)(context);

        return {
          isSuccess: true,
          nextNode: isMatch ? config.trueNode : config.falseNode,
        };
      },
    };
  },
};
