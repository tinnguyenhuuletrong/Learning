import { cc } from "bun:ffi";
import source from "./random.c" with { type: "file" };
export const {
  symbols: { myRandom, hello_napi },
} = cc({
  source,
  include: ["/Users/admin/.nvm/versions/node/v18.13.0/include"],
  symbols: {
    myRandom: {
      returns: "int",
      args: ["int", "int"],
    },
    hello_napi: {
      returns: "napi_value",
      args: ["napi_env"],
    },
  },
});

console.log("myRandom() =", myRandom(0, 5));
console.log("hello_napi() =", hello_napi());
