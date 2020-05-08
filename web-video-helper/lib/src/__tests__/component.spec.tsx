import * as React from "react";
import { Dummy } from "..";
import * as TestRenderer from "react-test-renderer";

test("Component should show 'red' text 'Hello World'", () => {
  const component = TestRenderer.create(<Dummy text="World" />);
  const testInstance = component.root;

  expect(testInstance.findByType(Dummy).props.text).toBe("World");

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
