import NodeMeta from "../src/index";

describe("basic", () => {
  it("create and run", async () => {
    const ins = NodeMeta.create({ label: "test", nextNode: "Next" });
    ins.exec({});
  });
});
