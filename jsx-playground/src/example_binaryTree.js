/** @jsx createNode */

const tree = (
  <Node value="12">
    <Node value="9" />
    <Node value="14">
      <Node value="16" />
    </Node>
  </Node>
);

console.log(tree);

function createNode(Element, props, left, right) {
  return new Element(props.value, left, right);
}

function Node(val, left, right) {
  this.val = val;
  this.left = left;
  this.right = right;
}
