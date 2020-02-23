window._rpcCallMap = new Map();

// Worker bridge
window.onWorkerMsg = ({ namespace, ev, extra }) => {
  if (namespace !== "system.opencv") return;
  switch (ev) {
    case "ready":
      {
        document.getElementById("status").innerHTML = "OpenCV.js is ready.";
        main();
      }
      break;
    case "cmd.response": {
      const { id, response } = extra;
      const resolver = window._rpcCallMap[id];
      window._rpcCallMap.delete(id);
      resolver && resolver(response);
    }

    default:
      break;
  }
};

async function webWorkerRPCCall(cmdName, params) {
  const id = Date.now();
  window.openCVWorker.postMessage({
    id,
    cmd: "cmd.process_grayscale",
    extra: params
  });
  return new Promise(resolve => {
    window._rpcCallMap[id] = resolve;
  });
}
