import * as wasm from "webasm-play";

window.wasm = wasm;

const h3Element = document.createElement("h3");
h3Element.append(`add(1,2) -> ${wasm.add(1, 2)}`);
document.body.appendChild(h3Element);

const btnElement = document.createElement("button");
btnElement.append("Say");
btnElement.onclick = () => wasm.greet();
document.body.appendChild(btnElement);
