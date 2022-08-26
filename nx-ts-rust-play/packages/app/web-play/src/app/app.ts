import * as Addon from '../../../../_artifacts/assets/rs-wasm';

export function sayHiFromJs() {
  return `JS: hello world`;
}

export function sayHiFromWasm() {
  return Addon.rs_wasm_bind();
}

export function alertHiFromWasm() {
  return Addon.greet();
}

export function parseCsv(inp: string) {
  return JSON.parse(Addon.csv_parse(inp) || '{}');
}

(window as any).Addon = Addon;
