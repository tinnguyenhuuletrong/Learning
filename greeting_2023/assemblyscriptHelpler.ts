import log from "npm:debug";

const asmLog = log("assemblyscript:");

function __liftString(
  memory: WebAssembly.ExportValue,
  pointer: number
): string {
  if (!pointer) return "";
  const buffer = (memory as any).buffer;
  const end = (pointer + new Uint32Array(buffer)[(pointer - 4) >>> 2]) >>> 1,
    memoryU16 = new Uint16Array(buffer);
  let start = pointer >>> 1,
    string = "";
  while (end - start > 1024)
    string += String.fromCharCode(
      ...memoryU16.subarray(start, (start += 1024))
    );
  return string + String.fromCharCode(...memoryU16.subarray(start, end));
}

export async function instantiate(
  module: WebAssembly.Module,
  imports: { env?: Record<string, string> } = {}
): Promise<WebAssembly.Exports> {
  const adaptedImports = {
    env: Object.assign(Object.create(globalThis), imports.env || {}, {
      "console.log"(text: number) {
        const outText = __liftString(memory, text >>> 0);
        asmLog(outText);
      },
    }),
  };
  const res = await WebAssembly.instantiate(module, adaptedImports);
  const exp = res.exports;
  const memory = exp.memory;
  return exp;
}
