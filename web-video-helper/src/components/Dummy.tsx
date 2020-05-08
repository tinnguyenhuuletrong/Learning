import * as React from "react";

interface DummyProps {
  text: string;
}

function Dummy({ text }: DummyProps) {
  return <div style={{ color: "red" }}>Hello {text}</div>;
}

export default Dummy;
