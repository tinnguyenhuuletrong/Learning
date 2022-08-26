import './style.css';
import * as App from './app/app';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <div class="wrapper">
    <div class="container">
      <div id="welcome">
        <h1>Hello Vite!</h1>
        
        <p class="mt-1">
          <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
        </p>
      </div>

      <div id="content">
        <pre>
          Hi from Js: ${App.sayHiFromJs()}
          Hi from Wasm: ${App.sayHiFromWasm()}
        </pre>

        <button 
          class="mt-1 button-pill rounded shadow"
          id="btnAlert" 
          onclick="showAlert()"> 
            <span>Wasm 👋</span>
          </button>
      </div>
    </div>
  </div>
`;

function showAlert() {
  App.alertHiFromWasm();
}
(window as any).showAlert = showAlert;
