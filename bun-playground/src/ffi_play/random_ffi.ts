import { cc } from "bun:ffi";

export const {
  symbols: { myRandom },
} = cc({
  source: "./random.c",
  symbols: {
    myRandom: {
      returns: "int",
      args: ["int", "int"],
    },
  },
});

console.log("myRandom() =", myRandom(0, 5));
