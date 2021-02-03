declare enum EFlowState {
    CONTINUE = 1,
    END = 0
}
interface IFlowRunRes {
    state: EFlowState;
    context: IFlowContext;
}
interface IFlowContext {
    activeNode: string;
    data: any;
}
declare function run(initContext: IFlowContext): Promise<IFlowRunRes>;
export { run };
