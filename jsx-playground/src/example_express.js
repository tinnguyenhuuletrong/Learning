/** @jsx pragma */
var debug = require("debug")("dev");
const express = require("express");

// Element Declare
const App = props => {
  debug("App", props);
  const app = express();
  for (const child of props.children) {
    child.method && app[child.method](child.path, child.handler);
  }
  return app;
};
const Get = props => {
  debug("Get", props);
  const { handler, path } = props;
  return { handler, path, method: "get" };
};
const Router = props => {
  debug("Router", props);
  const router = express.Router();
  for (const child of props.children) {
    router[child.method](child.path, child.handler);
  }
  return { method: "use", path: props.path, handler: router };
};

function pragma(Element, props) {
  const children = Array.prototype.slice.call(arguments, 2);
  return Element({ ...props, children });
}

// App
const FEATURE_FLAG_A = true;
const app = (
  <App>
    <Get path="/" handler={getStatus} />
    <Get path="/status" handler={getStatus} />
    {FEATURE_FLAG_A && (
      <Router path="/api">
        <Get path="/version" handler={getVersion} />
      </Router>
    )}
  </App>
);

function getStatus(req, res) {
  res.send("OK");
}

function getVersion(req, res) {
  res.json({ version: "1.0.0" });
}

app.listen(3000, () =>
  console.log(`server is running at http://localhost:3000`)
);
