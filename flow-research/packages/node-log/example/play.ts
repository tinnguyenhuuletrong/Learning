import NodeMeta from "../src/index";

const ins = NodeMeta.create({
  label: "Abc",
  nextNode: "Next",
});

ins.exec({});
