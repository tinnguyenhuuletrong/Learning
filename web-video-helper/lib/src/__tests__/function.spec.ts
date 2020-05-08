import { echo, hasGetUserMedia } from "..";

test("create a new hello", () => {
  expect(echo("World")).toBe("Hello World");
});

test("hasGetUserMedia", () => {
  expect(hasGetUserMedia()).toBe(true);
});
