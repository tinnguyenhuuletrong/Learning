// Can be build as standalone tool via
// bun build ./src/utils_copy_random_file.ts --compile --outfile=./bin/utils_copy_random_file

import { exists, rm } from "node:fs/promises";
import { parseArgs } from "util";
import { file, Glob } from "bun";
import { join } from "node:path";

const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    fromFolder: {
      type: "string",
      short: "f",
    },
    toFolder: {
      type: "string",
      short: "t",
    },
    globFilter: {
      type: "string",
      short: "f",
    },
    samples: {
      type: "string",
      short: "c",
    },
    help: {
      type: "boolean",
      short: "h",
    },
  },
  strict: true,
  allowPositionals: true,
});

const isValid = values.fromFolder && values.toFolder;
if (!isValid || values.help === true) {
  console.error(
    `
Usage: --fromFolder <path> --copyToFolder <path> --samples <num> --globFilter <glob_filter>
Examples: 
  utils_copy_random_file --globFilter="**/*.ts" --samples=2 --fromFolder="./" --toFolder="./tmp"
`
  );
  process.exit(1);
}

console.log("Args:", values);
const SRC_DIR = values.fromFolder ?? "";
const COPY_TO = values.toFolder ?? "";
const SAMPLE = parseInt(values.samples ?? "0");
const GLOB_FILTER = values.globFilter ?? "";
const glob = new Glob(GLOB_FILTER);
console.log(`1. GlobFilter: ${GLOB_FILTER} on ${SRC_DIR}`);

const allFiles = Array.from(glob.scanSync({ cwd: SRC_DIR }));
const total = allFiles.length;

if (total < SAMPLE) {
  console.error(
    `After glob scan found ${total} files < Sample size ${SAMPLE}. So please check it again!`
  );
  process.exit(1);
}

const samples = Array(SAMPLE)
  .fill(0)
  .map((itm) => Math.round(Math.random() * total))
  .map((idx) => allFiles[idx]);

console.log(`2. Pick random ${SAMPLE} / ${total}`);

if (await exists(COPY_TO)) {
  await rm(COPY_TO, { recursive: true, force: true });
}

console.log(`3. Copy`);
let count = 0;
for (const it of samples) {
  const srcPath = join(SRC_DIR, it);
  const ext = srcPath.split(".").at(-1);

  const desPath = join(COPY_TO, `sample_${count++}.${ext}`);
  const f = Bun.file(srcPath);
  Bun.write(desPath, f);
  console.log(`\t copied ${srcPath} -> ${desPath}`);
}

console.log(`4. Bye!`);
