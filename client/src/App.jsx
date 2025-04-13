// REACT IMPORTS
import { BrowserRouter, Routes, Route, Navigate } from "react-router";

// STYLE IMPORTS
import "./App.css";

import MainTabEditor from "./components/MainTabEditor";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import TablabContextLayout from "./layouts/TablabContextLayout";
import NotFound from "./pages/NotFound";
import Updates from "./pages/Updates";
import Guide from "./pages/Guide";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import RequireAuth from "./components/RequireAuth";
import { AuthProvider } from "./context/authProvider";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Static Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/guide" element={<Guide />} />

          {/* Authentication Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Pages */}
          <Route element={<RequireAuth />}>
            <Route path="/profile" element={<Profile />} />
            <Route element={<TablabContextLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/editor/:tabId" element={<MainTabEditor />} />
              <Route
                path="/editor/*"
                element={<Navigate to="/notfound" replace />}
              />
            </Route>
          </Route>

          {/* Catch All Pages */}
          <Route path="notfound" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/notfound" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
