// https://www.typescriptlang.org/docs/handbook/utility-types.html

declare type FBullQueue = typeof import("./libs/BullQueue");

declare module NodeJS {
  interface Global {
    BullQueue: FBullQueue;
  }
}
