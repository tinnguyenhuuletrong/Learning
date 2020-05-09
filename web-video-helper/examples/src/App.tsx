import React from "react";
import "./App.css";
import { WebcamRenderToVideo, WebcamRenderToCanvas } from "web-video-helper";

const videoConstraints = {
  width: 256,
};
const video2Constraints = {
  width: 512,
};
declare global {
  interface Window {
    doCapture: Function;
  }
}

function App() {
  const context = React.useRef<any>({});
  const [captureSrc, setCaptureSrc] = React.useState<string>();

  const captureCallback = () => {
    context.current.captureFn && setCaptureSrc(context.current.captureFn());
  };

  return (
    <div className="App">
      <header className="App-header">Sample</header>
      <main className="App-main">
        <h3>Canvas element</h3>
        <WebcamRenderToCanvas
          syncFps={60}
          audio={false}
          forceScreenshotSourceSize
          videoConstraints={videoConstraints}
          onUserMedia={({ doCapture }) => {
            window.doCapture = doCapture;
            context.current.captureFn = doCapture;
          }}
        />
        {/* <h3>Video element</h3> */}
        {/* <WebcamRenderToVideo videoConstraints={video2Constraints} /> */}
        <button onClick={captureCallback}>capture</button>
        <img src={captureSrc} alt="" />
      </main>
      <footer className="App-footer"> @Copyright TTin 2020 </footer>
    </div>
  );
}

export default App;
