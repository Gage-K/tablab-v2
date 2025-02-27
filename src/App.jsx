// REACT IMPORTS
import { BrowserRouter, Routes, Route } from "react-router";

// STYLE IMPORTS
import "./App.css";

import MainTabEditor from "./components/MainTabEditor";
import Dashboard from "./pages/Dashboard";
import TablabContextLayout from "./layouts/TablabContextLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<TablabContextLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/editor/:tabId" element={<MainTabEditor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
