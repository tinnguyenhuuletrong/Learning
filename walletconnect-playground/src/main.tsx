import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import * as utils from "./ethPersonalSignValidator";
(window as any).utils = utils;

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
