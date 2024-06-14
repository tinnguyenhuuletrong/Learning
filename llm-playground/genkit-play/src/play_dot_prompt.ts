import { loadPromptFile } from "@genkit-ai/dotprompt";
import { configureGenkit } from "@genkit-ai/core";
import { vertexAI } from "@genkit-ai/vertexai";
import { generate } from "@genkit-ai/ai";
import path from "path";

async function main() {
  configureGenkit({
    plugins: [vertexAI()],
  });

  console.log("-----------");
  console.log("load prompt", "./img_des.prompt");
  console.log("-----------");

  // Load a prompt from a file
  const myPrompt = await loadPromptFile(
    path.resolve(__dirname, "./img_des.prompt")
  );

  console.log("-----------");
  console.log("render");
  console.log("-----------");
  const msg = myPrompt.render({
    input: {
      photoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Cat_August_2010-4.jpg/181px-Cat_August_2010-4.jpg",
      objectName: "cat",
    },
  });

  console.dir(msg, { depth: 10 });

  console.log("-----------");
  console.log("eval");
  console.log("-----------");

  const res = await generate(msg);

  console.log("-----------");
  console.log("Output 0");
  console.log("-----------");

  const outputObj = res.output(0);
  console.dir(outputObj, { depth: 10 });
}

main();
