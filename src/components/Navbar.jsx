import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);

  /* =========================================
     LOAD CURRENT USER
  ========================================= */

  const loadUser = () => {
    const savedUser = localStorage.getItem(
      "jobconnect_current_user"
    );

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
      } catch (error) {
        console.error(
          "Failed to load current user:",
          error
        );

        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
  };

  /* =========================================
     EFFECT
  ========================================= */

  useEffect(() => {
    loadUser();

    window.addEventListener(
      "userLogin",
      loadUser
    );

    window.addEventListener(
      "userLogout",
      loadUser
    );

    return () => {
      window.removeEventListener(
        "userLogin",
        loadUser
      );

      window.removeEventListener(
        "userLogout",
        loadUser
      );
    };
  }, []);

  /* =========================================
     LOGOUT
  ========================================= */

  const handleLogout = () => {
    localStorage.removeItem(
      "jobconnect_current_user"
    );

    setCurrentUser(null);

    window.dispatchEvent(
      new Event("userLogout")
    );

    navigate("/");
  };

  /* =========================================
     ROLE NAME
  ========================================= */

  const getRoleName = () => {
    if (!currentUser) {
      return "";
    }

    if (currentUser.role === "admin") {
      return "Admin";
    }

    if (currentUser.role === "recruiter") {
      return "Recruiter";
    }

    return "Candidate";
  };

  return (
    <nav className="navbar">

      {/* =====================================
          LOGO
      ===================================== */}

      <Link
        to="/"
        className="logo"
      >
        Job<span>Connect</span>
      </Link>


      {/* =====================================
          NAVIGATION LINKS
      ===================================== */}

      <div className="nav-links">

        {/* HOME */}

        <Link to="/">
          Home
        </Link>


        {/* FIND JOBS */}

        <a href="/#jobs">
          Find Jobs
        </a>


        {/* =================================
            ADMIN LOGGED IN
        ================================= */}

        {currentUser?.role === "admin" && (
          <Link to="/admin-dashboard">
            Admin Dashboard
          </Link>
        )}


        {/* =================================
            RECRUITER
        ================================= */}

        {currentUser?.role === "recruiter" && (
          <>
            <Link to="/recruiter-dashboard">
              Dashboard
            </Link>

            <Link to="/post-job">
              Post Job
            </Link>
          </>
        )}


        {/* =================================
            CANDIDATE
        ================================= */}

        {currentUser?.role === "candidate" && (
          <Link to="/applications">
            Applications
          </Link>
        )}


        {/* =================================
            PROFILE
        ================================= */}

        {currentUser && (
          <Link to="/profile">
            Profile
          </Link>
        )}

      </div>


      {/* =====================================
          RIGHT SIDE
      ===================================== */}

      <div className="nav-actions">

        {currentUser ? (

          /* =================================
             LOGGED IN
          ================================= */

          <>

            {/* USER NAME */}

            <span className="profile-nav-link">
              👤 {currentUser.name}
            </span>


            {/* ROLE BADGE */}

            <span className="role-badge">
              {getRoleName()}
            </span>


            {/* LOGOUT */}

            <button
              type="button"
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </>

        ) : (

          /* =================================
             LOGGED OUT
          ================================= */

          <>

            {/* ADMIN LOGIN */}

            <Link
              to="/admin-login"
              className="login-link"
            >
              Admin
            </Link>


            {/* NORMAL LOGIN */}

            <Link
              to="/login"
              className="login-link"
            >
              Login
            </Link>


            {/* REGISTER */}

            <Link
              to="/register"
              className="nav-register"
            >
              Register
            </Link>

          </>

        )}

      </div>

    </nav>
  );
}

export default Navbar;