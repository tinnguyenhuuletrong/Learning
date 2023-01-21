import log from "npm:debug";
import { exec, OutputMode } from "https://deno.land/x/exec/mod.ts";
import { instantiate } from "./assemblyscriptHelpler.ts";

// https://www.assemblyscript.org/editor.html#IyFvcHRpbWl6ZT1zcGVlZCZydW50aW1lPXN0dWIKLyoqIENhbGN1bGF0ZXMgdGhlIG4tdGggRmlib25hY2NpIG51bWJlci4gKi8KZXhwb3J0IGZ1bmN0aW9uIGhlbGxvXzIwMjMoKTogdm9pZCB7CiAgdmFyIGkgOiBpMzI7CiAgZm9yKGk9MDtpPDIwMjM7aSsrKSB7CiAgICBjb25zb2xlLmxvZygnV0FTTTogaGVsbG8gMjAyMycpCiAgfQp9CiMhaHRtbAo8dGV4dGFyZWEgaWQ9Im91dHB1dCIgc3R5bGU9ImhlaWdodDogMTAwJTsgd2lkdGg6IDEwMCUiIHJlYWRvbmx5PjwvdGV4dGFyZWE+CjxzY3JpcHQgdHlwZT0ibW9kdWxlIj4KY29uc3QgZXhwb3J0cyA9IGF3YWl0IGluc3RhbnRpYXRlKGF3YWl0IGNvbXBpbGUoKSwgeyAvKiBpbXBvcnRzICovIH0pCmNvbnN0IG91dHB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvdXRwdXQnKQpvdXRwdXQudmFsdWUgKz0gYGhlbGxvXzIwMjMoKSA9ICR7ZXhwb3J0cy5oZWxsb18yMDIzKCl9XG5gCjwvc2NyaXB0Pg==
async function compile() {
  return await WebAssembly.compile(
    new Uint8Array([
      0, 97, 115, 109, 1, 0, 0, 0, 1, 8, 2, 96, 1, 127, 0, 96, 0, 0, 2, 19, 1,
      3, 101, 110, 118, 11, 99, 111, 110, 115, 111, 108, 101, 46, 108, 111, 103,
      0, 0, 3, 2, 1, 1, 4, 4, 1, 112, 0, 1, 5, 3, 1, 0, 1, 7, 31, 3, 10, 104,
      101, 108, 108, 111, 95, 50, 48, 50, 51, 0, 1, 6, 109, 101, 109, 111, 114,
      121, 2, 0, 5, 116, 97, 98, 108, 101, 1, 0, 9, 6, 1, 0, 65, 1, 11, 0, 12,
      1, 2, 10, 32, 1, 30, 1, 1, 127, 3, 64, 32, 0, 65, 231, 15, 72, 4, 64, 65,
      160, 8, 16, 0, 32, 0, 65, 1, 106, 33, 0, 12, 1, 11, 11, 11, 11, 53, 2, 0,
      65, 140, 8, 11, 1, 60, 0, 65, 152, 8, 11, 39, 2, 0, 0, 0, 32, 0, 0, 0, 87,
      0, 65, 0, 83, 0, 77, 0, 58, 0, 32, 0, 104, 0, 101, 0, 108, 0, 108, 0, 111,
      0, 32, 0, 50, 0, 48, 0, 50, 0, 51,
    ])
  );
}

async function grettingFromGo() {
  const denoLog = log("go:");
  const res = await exec("go run hello_2023.go", {
    output: OutputMode.Capture,
  });
  denoLog(res.output);
}

function grettingFromDeno() {
  const denoLog = log("deno:");
  for (let i = 0; i < 2023; i++) {
    denoLog("Hello Luna new year 2023 !!!! 🎉🎉🎉🎉🎉");
  }
}

async function grettingFromWASM() {
  const exports = await instantiate(await compile(), {
    /* imports */
  });
  const hello_2023 = exports["hello_2023"];
  if (hello_2023 instanceof Function) hello_2023();
}

async function main() {
  await Promise.all([grettingFromDeno(), grettingFromGo(), grettingFromWASM()]);
}

main();
