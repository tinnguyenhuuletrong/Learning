import React from "react";

const uri = "worker/opencv_face_worker.js";

function useFaceDetectWorker({ detectFps = 10, onFaces }) {
  const workerContext = React.useRef({
    worker: null,
    _lastTime: Date.now(),
    _rpcCallMap: {},
  });
  const [ready, setReady] = React.useState(false);

  const onFrame = React.useCallback(async (imageData) => {
    const sleepMs = 1000 / detectFps;
    const now = Date.now();
    if (now - workerContext.current._lastTime < sleepMs) return;

    workerContext.current._lastTime = now;
    const faceRecArr = await workerContext.current.worker.webWorkerRPCCall(
      "cmd.detect_faces",
      imageData
    );
    if (faceRecArr && faceRecArr.length > 0) onFaces && onFaces(faceRecArr);
    return faceRecArr;
  }, []);

  React.useEffect(() => {
    const worker = new Worker(uri);
    workerContext.current.worker = worker;

    worker.onerror = (err) => console.error(err);
    worker.onmessage = (evt) => {
      const { namespace, ev, extra } = evt.data;
      if (namespace !== "system.opencv") return;
      switch (ev) {
        case "ready":
          setReady(true);
          break;
        case "cmd.response": {
          const { id, response } = extra;
          const resolver = workerContext.current._rpcCallMap[id];
          delete workerContext.current._rpcCallMap[id];
          resolver && resolver(response);
          break;
        }
        default:
          break;
      }
    };

    worker.webWorkerRPCCall = (cmdName, params) => {
      const id = Date.now();
      worker.postMessage({
        id,
        cmd: cmdName,
        extra: params,
      });

      return new Promise((resolve) => {
        workerContext.current._rpcCallMap[id] = resolve;
      });
    };

    return () => {
      worker.terminate();
    };
  }, []);

  return [ready, onFrame];
}

export default useFaceDetectWorker;
