import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../Auth.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "candidate",
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

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    const existingUsers =
      JSON.parse(
        localStorage.getItem("jobconnect_users")
      ) || [];

    const userExists = existingUsers.some(
      (user) =>
        user.email.toLowerCase() ===
        formData.email.toLowerCase()
    );

    if (userExists) {
      setError(
        "An account with this email already exists."
      );
      return;
    }

    const newUser = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    const updatedUsers = [
      ...existingUsers,
      newUser,
    ];

    localStorage.setItem(
      "jobconnect_users",
      JSON.stringify(updatedUsers)
    );

    alert("Registration successful!");

    navigate("/login");
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          Job<span>Connect</span>
        </div>

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Join JobConnect and find your next opportunity
        </p>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          {/* NAME */}

          <div className="form-group">

            <label>
              Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
            />

          </div>


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


          {/* ROLE */}

          <div className="form-group">

            <label>
              Account Type
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >

              <option value="candidate">
                Candidate - Looking for a job
              </option>

              <option value="recruiter">
                Recruiter - Hiring candidates
              </option>

            </select>

          </div>


          {/* PASSWORD */}

          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />

          </div>


          {/* CONFIRM PASSWORD */}

          <div className="form-group">

            <label>
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

          </div>


          {/* REGISTER */}

          <button
            type="submit"
            className="auth-btn"
          >
            Create Account
          </button>

        </form>


        {/* LOGIN */}

        <div className="auth-bottom">

          Already have an account?{" "}

          <Link
            to="/login"
            className="auth-link"
          >
            Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;