import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="logo">
        Job<span>Connect</span>
      </Link>

      {/* Navigation */}
      <div className="nav-links">
  <Link to="/#jobs">Find Jobs</Link>

  <Link to="/companies">Companies</Link>

  <Link to="/about">About</Link>

  <Link to="/profile">Profile</Link>

  {/* Recruiter */}
  <Link to="/post-job" className="post-job-link">
    Post Job
  </Link>

  <Link to="/login">Login</Link>

  <Link to="/register" className="register-btn">
    Register
  </Link>
</div>
    </nav>
  );
}

export default Navbar;