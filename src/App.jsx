import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

/* =========================================
   GENERAL PAGES
========================================= */

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";

/* =========================================
   RECRUITER PAGES
========================================= */

import PostJob from "./pages/PostJob";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import RecruiterApplications from "./pages/RecruiterApplications";

/* =========================================
   CANDIDATE PAGES
========================================= */

import ApplyJob from "./pages/ApplyJob";
import Applications from "./pages/Applications";

/* =========================================
   ADMIN PAGES
========================================= */

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

/* =========================================
   CSS
========================================= */

import "./App.css";


function App() {
  return (
    <BrowserRouter>

      {/* =====================================
          NAVBAR
      ===================================== */}

      <Navbar />


      {/* =====================================
          ROUTES
      ===================================== */}

      <Routes>

        {/* ===================================
            HOME
        =================================== */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* ===================================
            LOGIN
        =================================== */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* ===================================
            REGISTER
        =================================== */}

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ===================================
            FORGOT PASSWORD
        =================================== */}

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />


        {/* ===================================
            ADMIN LOGIN
        =================================== */}

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />


        {/* ===================================
            PROFILE
        =================================== */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


        {/* ===================================
            RECRUITER
            POST JOB
        =================================== */}

        <Route
          path="/post-job"
          element={
            <ProtectedRoute role="recruiter">
              <PostJob />
            </ProtectedRoute>
          }
        />


        {/* ===================================
            RECRUITER
            DASHBOARD
        =================================== */}

        <Route
          path="/recruiter-dashboard"
          element={
            <ProtectedRoute role="recruiter">
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />


        {/* ===================================
            RECRUITER
            APPLICATIONS
        =================================== */}

        <Route
          path="/applications/:jobId"
          element={
            <ProtectedRoute role="recruiter">
              <RecruiterApplications />
            </ProtectedRoute>
          }
        />


        {/* ===================================
            CANDIDATE
            APPLY JOB
        =================================== */}

        <Route
          path="/apply/:jobId"
          element={
            <ProtectedRoute role="candidate">
              <ApplyJob />
            </ProtectedRoute>
          }
        />


        {/* ===================================
            CANDIDATE
            APPLICATIONS
        =================================== */}

        <Route
          path="/applications"
          element={
            <ProtectedRoute role="candidate">
              <Applications />
            </ProtectedRoute>
          }
        />


        {/* ===================================
            ADMIN
            DASHBOARD
        =================================== */}

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;