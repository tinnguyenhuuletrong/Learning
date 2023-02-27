process.env.DEBUG = "*";

import { useEffect, useState, createContext, useContext } from "react";
import { reconciler, createNode } from "./tsxRuntime";

const GlobalSetting = createContext(null);

const Log = (props: any) => {
  const globalSetting = useContext(GlobalSetting);
  const val = [
    globalSetting.now().toISOString(),
    " - ",
    props.children.join(""),
  ];
  return <console-log>{val.join("")}</console-log>;
};

const App = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((v) => v + 1);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [setCount]);

  const shouldShow = count % 2 === 0;

  return shouldShow && <Log>Counter: {count}</Log>;
};

function app() {
  return (
    <GlobalSetting.Provider
      value={{
        now: () => new Date(),
      }}
    >
      <App />;
    </GlobalSetting.Provider>
  );
}

async function main() {
  const rootNode = createNode("root", {});
  const ins = reconciler.updateContainer(
    app(),
    reconciler.createContainer(
      rootNode,
      0,
      null,
      false,
      null,
      "",
      () => {},
      null
    ),
    null,
    console.log
  );
}

main();
