import { echo } from "..";

test("create a new hello", () => {
  expect(echo("World")).toBe("Hello World");
});
