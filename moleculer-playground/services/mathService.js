const { promisify } = require("util");
const waitForMs = promisify(setTimeout);

function calFibo(index) {
  if (index === 0 || index === 1) return 1;
  return calFibo(index - 1) + calFibo(index - 2);
}

module.exports = {
  name: "math",
  actions: {
    add: {
      params: {
        a: "number",
        b: "number",
      },
      handler: (ctx) => {
        return Number(ctx.params.a) + Number(ctx.params.b);
      },
    },

    sub: {
      params: {
        a: "number",
        b: "number",
      },
      handler: (ctx) => {
        return Number(ctx.params.a) - Number(ctx.params.b);
      },
    },

    fibo: {
      params: {
        index: "number",
      },
      handler: async (ctx) => {
        return calFibo(ctx.params.index);
      },
    },
  },
};
