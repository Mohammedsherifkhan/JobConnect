import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import PostJob from "./pages/PostJob";
import ApplyJob from "./pages/ApplyJob";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import Applications from "./pages/Applications";
import RecruiterApplications from "./pages/RecruiterApplications";

import "./App.css";

function App() {
  return (
    <BrowserRouter>

      {/* NAVBAR */}
      <Navbar />

      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* FORGOT PASSWORD */}
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* POST JOB - RECRUITER */}
        <Route
          path="/post-job"
          element={
            <ProtectedRoute role="recruiter">
              <PostJob />
            </ProtectedRoute>
          }
        />

        {/* RECRUITER DASHBOARD */}
        <Route
          path="/recruiter-dashboard"
          element={
            <ProtectedRoute role="recruiter">
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

        {/* APPLY JOB - CANDIDATE */}
        <Route
          path="/apply/:jobId"
          element={
            <ProtectedRoute role="candidate">
              <ApplyJob />
            </ProtectedRoute>
          }
        />

        {/* CANDIDATE APPLICATIONS */}
        <Route
          path="/applications"
          element={
            <ProtectedRoute role="candidate">
              <Applications />
            </ProtectedRoute>
          }
        />

        {/* RECRUITER APPLICATIONS */}
        <Route
          path="/applications/:jobId"
          element={
            <ProtectedRoute role="recruiter">
              <RecruiterApplications />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;