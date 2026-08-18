import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />

        {/* Temporary pages */}
        <Route
          path="/companies"
          element={<h1 style={{ padding: "100px" }}>Companies</h1>}
        />

        <Route
          path="/about"
          element={<h1 style={{ padding: "100px" }}>About JobConnect</h1>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;