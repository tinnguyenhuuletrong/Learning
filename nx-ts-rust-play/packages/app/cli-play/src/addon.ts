// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import * as myaddon from '../../../_artifacts/assets/librs_node_bind.node';

export interface AddonModule {
  hello(): string;
  csvParse(inp: string): string;
}

export default myaddon as AddonModule;
