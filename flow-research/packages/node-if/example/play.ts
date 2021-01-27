import NodeMeta from "../src/index";

const ins = NodeMeta.create({
  condition: {
    age: { $gt: 18 },
  },
  trueNode: "Upper 18",
  falseNode: "Under 18",
});

ins.exec({});
