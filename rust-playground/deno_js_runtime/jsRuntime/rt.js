const { core } = Deno;
const { ops } = core;

function argsToMessage(...args) {
  return args.map((arg) => JSON.stringify(arg)).join(" ");
}

const console = {
  log: (...args) => {
    core.print(`[out]: ${argsToMessage(...args)}\n`, false);
  },
  error: (...args) => {
    core.print(`[err]: ${argsToMessage(...args)}\n`, true);
  },
};

const runjs = Object.freeze({
    // readFile: (path) => {
    //     return ops.op_read_file(path);
    //   },

    say: () => {
      console.log('[runjs.say]: hello there')
    }
})

globalThis.setTimeout = async (delay) => {
  return ops.op_set_timeout(delay)
};
globalThis.console = console;
globalThis.runjs = runjs;