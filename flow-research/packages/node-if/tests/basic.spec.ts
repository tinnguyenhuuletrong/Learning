import NodeMeta from "../src/index";

describe("basic", () => {
  it("create and run", async () => {
    const ins = NodeMeta.create({
      condition: {
        age: { $gt: 18 },
      },
      trueNode: "Upper 18",
      falseNode: "Under 18",
    });
    let res;
    res = await ins.exec({ age: 10 });
    expect(res).toMatchSnapshot();

    res = await ins.exec({ age: 20 });
    expect(res).toMatchSnapshot();
  });
});
