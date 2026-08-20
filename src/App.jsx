import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import PostJob from "./pages/PostJob";

import "./App.css";

function App() {
  return (
    <BrowserRouter>

      {/* ONE NAVBAR ONLY */}
      <Navbar />

      <Routes>

        {/* Candidate Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />

        {/* Recruiter Pages */}
        <Route path="/post-job" element={<PostJob />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;