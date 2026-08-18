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
        <Link to="/">Find Jobs</Link>
        <Link to="/companies">Companies</Link>
        <Link to="/about">About</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/login">Login</Link>

        {/* Highlighted Register */}
        <Link to="/register" className="register-btn">
          Register
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;