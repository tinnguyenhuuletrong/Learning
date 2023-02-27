import debug from "debug";
import ReactReconciler from "react-reconciler";
import { DefaultEventPriority } from "react-reconciler/constants";

const log = debug("tsxRuntime");

export function createNode(nodeName, props) {
  log("createNode", nodeName, props);

  if (nodeName === "console-log") {
    console.log(props);
  }

  return {
    nodeName,
    props,
    childNodes: [],
  };
}
function appendChildNode(parentNode, childNode) {
  log("appendChildNode", parentNode, childNode);
  parentNode.childNodes.push(childNode);
}

function insertBeforeNode(node, newChildNode, beforeChildNode) {
  // fallback to appendChild. Need check here again
  appendChildNode(node, newChildNode);
}

function removeChildNode(parentNode, removedNode) {
  log("removeChildNode", parentNode, removedNode);
  parentNode.childNodes = parentNode.childNodes.filter(
    (itm) => itm !== removedNode
  );
}

function updateNode(
  node,
  _updatePayload: unknown,
  _type: unknown,
  oldProps,
  newProps
) {
  log("updateNode", node, { oldProps, newProps });
  node.props = newProps;
  if (node.nodeName === "console-log") {
    console.log(node.props);
  }
}

const rootHostContext = {};
const childHostContext = {};

const hostConfig = {
  // schedulePassiveEffects,
  // cancelPassiveEffects,
  now: Date.now,
  getRootHostContext: () => {
    return rootHostContext;
  },
  prepareForCommit: () => ({}),
  resetAfterCommit: () => {},
  getChildHostContext: () => {
    return childHostContext;
  },
  shouldSetTextContent: (_type: unknown, _props: unknown) => {
    return false;
    // return typeof props.children === 'string' || typeof props.children === 'number';
  },
  createInstance: createNode,
  createTextInstance: () => {},
  resetTextContent: (_node: unknown) => {},
  getPublicInstance: (instance: unknown) => instance,
  appendInitialChild: appendChildNode,
  appendChild: appendChildNode,
  insertBefore: insertBeforeNode,
  finalizeInitialChildren: () => false,
  supportsMutation: true,
  appendChildToContainer: appendChildNode,
  insertInContainerBefore: insertBeforeNode,
  removeChildFromContainer: removeChildNode,
  prepareUpdate: () => true,
  commitUpdate: updateNode,
  commitTextUpdate: (
    _node: unknown,
    _oldText: unknown,
    _newText: unknown
  ) => {},
  removeChild: removeChildNode,
  shouldDeprioritizeSubtree: () => false,
  scheduleDeferredCallback: () => {},
  cancelDeferredCallback: () => {},
  setTimeout: () => {},
  clearTimeout: () => {},
  noTimeout: () => {},
  isPrimaryRenderer: false,
  supportsPersistence: false,
  supportsHydration: false,
  preparePortalMount: () => {},
  scheduleTimeout: () => {},
  cancelTimeout: () => {},
  getCurrentEventPriority: () => {
    return DefaultEventPriority;
  },
  getInstanceFromNode: () => {
    return undefined;
  },
  beforeActiveInstanceBlur: () => {},
  afterActiveInstanceBlur: () => {},
  prepareScopeUpdate: () => {},
  getInstanceFromScope: () => {},
  detachDeletedInstance: () => {},
  clearContainer: () => {},
};

export const reconciler = ReactReconciler(hostConfig);
