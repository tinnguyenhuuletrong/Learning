import React from "react";
import "./App.css";
import { WebcamRenderToVideo } from "web-video-helper";

const videoConstraints = {
  width: 256,
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
        <WebcamRenderToVideo
          audio={false}
          forceScreenshotSourceSize
          videoConstraints={videoConstraints}
          onUserMedia={({ doCapture }) => {
            window.doCapture = doCapture;
            context.current.captureFn = doCapture;
          }}
        />
        <button onClick={captureCallback}>capture</button>
        <img src={captureSrc} alt="" />
      </main>
      <footer className="App-footer"> @Copyright TTin 2020 </footer>
    </div>
  );
}

export default App;
