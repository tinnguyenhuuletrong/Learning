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
    label: "START",
    nextNode: "ConditionCheck",
  });

  const nodeLogEnd = NodeLog.create({
    label: "END",
    nextNode: "",
  });

  const nodeLogSuccess = NodeLog.create({
    label: "UPPER 18. Can access service",
    nextNode: "END",
  });

  const nodeLogFailed = NodeLog.create({
    label: "UNDER 18. Bye",
    nextNode: "END",
  });

  const nodeCondition = NodeIf.create({
    condition: { age: { $gt: 18 } },
    trueNode: "SuccessLog",
    falseNode: "EndLog",
  });

  return {
    context,
    nodes: [
      constructNode("START", nodeLogStart),
      constructNode("ConditionCheck", nodeCondition),
      constructNode("SuccessLog", nodeLogSuccess),
      constructNode("EndLog", nodeLogFailed),
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

  const res = (await activeNodeIns.ins.exec(
    flowIns.context.data
  )) as IExeResult;

  if (res.isSuccess) {
    if (res.nextNode) {
      flowIns.context.activeNode = res.nextNode;
    } else return { state: EFlowState.END, context: initContext };
  } else throw new Error("Node exec error");

  return { state: EFlowState.CONTINUE, context: flowIns.context };
}

export { run };
