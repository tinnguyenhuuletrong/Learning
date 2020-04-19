import React, { Suspense, lazy } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import "./app.css";

const PageTest1 = lazy(() => import("./Page/Test1"));
const PageTest2 = lazy(() => import("./Page/Test2"));

const App = () => {
  return (
    <BrowserRouter>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/test1">Test1</Link>
          </li>
          <li>
            <Link to="/test2">Test2</Link>
          </li>
        </ul>
      </nav>
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route path="/test1">
              <PageTest1 />
            </Route>
            <Route path="/test2">
              <PageTest2 />
            </Route>
            <Route path="/">Nothing :)</Route>
          </Switch>
        </Suspense>
      </main>
    </BrowserRouter>
  );
};

export default App;
