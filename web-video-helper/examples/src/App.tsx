import React from "react";
import "./App.css";
import { Example1 } from "./components/Example1";
import { Example2 } from "./components/Example2";

function App() {
  return (
    <div className="App">
      <header className="App-header">Sample</header>
      <main className="App-main">
        <Example2 />
      </main>
      <footer className="App-footer"> @Copyright TTin 2020 </footer>
    </div>
  );
}

export default App;
