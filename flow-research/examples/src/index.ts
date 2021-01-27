import { IExeResult } from "@ttinflow/types";
import NodeLog from "@ttinflow/node-log";
import NodeIf from "@ttinflow/node-if";

enum EFlowState {
  CONTINUE = 1,
  END = 0,
}

interface IFlowRunRes {
  state: EFlowState;
  context: IFlowContext;
}

interface INode {
  id: string;
  ins: any;
}

interface IFlowContext {
  activeNode: string;
  data: any;
}

interface IFlowInstance {
  context?: IFlowContext;
  nodes: INode[];
}

function constructNode(id, ins): INode {
  return {
    id,
    ins,
  };
}

function createFlow(context?: IFlowContext): IFlowInstance {
  const nodeLogStart = NodeLog.create({
    label: "start",
    nextNode: "ConditionCheck",
  });

  const nodeLogEnd = NodeLog.create({
    label: "end",
    nextNode: "",
  });

  const nodeLogSuccess = NodeLog.create({
    label: "success",
    nextNode: "END",
  });

  const nodeLogFailed = NodeLog.create({
    label: "failed",
    nextNode: "END",
  });

  const nodeCondition = NodeIf.create({
    condition: {},
    trueNode: "SuccessLog",
    falseNode: "EndLog",
  });

  return {
    context,
    nodes: [
      constructNode("START", nodeLogStart),
      constructNode("ConditionCheck", nodeLogSuccess),
      constructNode("SuccessLog", nodeLogFailed),
      constructNode("EndLog", nodeCondition),
      constructNode("END", nodeLogEnd),
    ],
  };
}

async function run(initContext: IFlowContext): Promise<IFlowRunRes> {
  const flowIns = createFlow(initContext);

  const activeNodeIns = flowIns.nodes.find(
    (itm) => itm.id === flowIns.context.activeNode
  );

  // END check
  if (!activeNodeIns) return { state: EFlowState.END, context: initContext };
  if (activeNodeIns.id === "END")
    return { state: EFlowState.END, context: initContext };

  const res = (await activeNodeIns.ins.exec(
    flowIns.context.data
  )) as IExeResult;

  if (res.isSuccess) {
    if (res.nextNode) flowIns.context.activeNode = res.nextNode;
    else throw new Error("Node exec error");
  }

  return { state: EFlowState.CONTINUE, context: flowIns.context };
}

async function main() {
  const context = {
    activeNode: "START",
    data: {},
  };

  let state: IFlowRunRes;
  do {
    state = await run(context);
  } while (state.state !== EFlowState.END);
}

main();
