import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageIndex from "./pages/PageIndex";
import { PagePuckEditor } from "./pages/PagePuckEditor";
import { PagePuckViewer } from "./pages/PagePuckViewer";

function App() {
  return (
    <>
      <header></header>
      <main>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PageIndex />} />
            <Route path="/editor" element={<PagePuckEditor />} />
            <Route path="/view" element={<PagePuckViewer />} />
          </Routes>
        </BrowserRouter>
      </main>
    </>
  );
}

export default App;
