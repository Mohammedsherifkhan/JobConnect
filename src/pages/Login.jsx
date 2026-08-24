import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../Auth.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    // Validation
    if (!formData.email || !formData.password) {
      setError("Please enter email and password.");
      return;
    }

    // Get registered users
    const users =
      JSON.parse(
        localStorage.getItem("jobconnect_users")
      ) || [];

    // Find matching user
    const user = users.find(
      (item) =>
        item.email.toLowerCase() ===
          formData.email.toLowerCase() &&
        item.password === formData.password
    );

    // Wrong credentials
    if (!user) {
      setError("Invalid email or password.");
      return;
    }

    // Save logged-in user
    localStorage.setItem(
      "jobconnect_current_user",
      JSON.stringify(user)
    );

    // Tell Navbar that login happened
    window.dispatchEvent(
      new Event("userLogin")
    );

    // Go to Home
    navigate("/");
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        {/* LOGO */}

        <div className="auth-logo">
          Job<span>Connect</span>
        </div>

        {/* TITLE */}

        <h1>
          Welcome Back
        </h1>

        <p className="auth-subtitle">
          Login to continue to JobConnect
        </p>

        {/* ERROR */}

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {/* FORM */}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          {/* EMAIL */}

          <div className="form-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />

          </div>


          {/* PASSWORD */}

          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />

          </div>


          {/* FORGOT PASSWORD */}

          <div className="forgot-link">

            <Link
              to="/forgot-password"
              className="auth-link"
            >
              Forgot Password?
            </Link>

          </div>


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="auth-btn"
          >
            Login
          </button>

        </form>


        {/* REGISTER */}

        <div className="auth-bottom">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="auth-link"
          >
            Create Account
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;