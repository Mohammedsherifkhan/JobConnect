import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  const loadUser = () => {
    const savedUser = localStorage.getItem(
      "jobconnect_current_user"
    );

    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    } else {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    loadUser();

    window.addEventListener("userLogin", loadUser);
    window.addEventListener("userLogout", loadUser);

    return () => {
      window.removeEventListener("userLogin", loadUser);
      window.removeEventListener("userLogout", loadUser);
    };
  }, []);

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

  return (
    <nav className="navbar">

      {/* ================= LOGO ================= */}

      <Link to="/" className="logo">
        Job<span>Connect</span>
      </Link>


      {/* ================= NAV LINKS ================= */}

      <div className="nav-links">

        {/* HOME */}

        <Link to="/">
          Home
        </Link>


        {/* FIND JOBS */}

        <a href="/#jobs">
          Find Jobs
        </a>


        {/* ================= RECRUITER ================= */}

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


        {/* ================= CANDIDATE ================= */}

        {currentUser?.role === "candidate" && (
          <Link to="/applications">
            Applications
          </Link>
        )}


        {/* ================= PROFILE ================= */}

        {currentUser && (
          <Link to="/profile">
            Profile
          </Link>
        )}

      </div>


      {/* ================= RIGHT SIDE ================= */}

      <div className="nav-actions">

        {currentUser ? (

          <>

            {/* USER NAME */}

            <span className="profile-nav-link">
              👤 {currentUser.name}
            </span>


            {/* ROLE */}

            <span className="role-badge">

              {currentUser.role === "recruiter"
                ? "Recruiter"
                : "Candidate"}

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

          <>

            {/* LOGIN */}

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