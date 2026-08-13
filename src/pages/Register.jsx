import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "jobseeker",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    alert("Registration UI working successfully!");

    navigate("/login");
  };

  return (
    <div className="auth-page">

      <div className="auth-background-circle circle-one"></div>
      <div className="auth-background-circle circle-two"></div>

      <div className="auth-card register-card">

        <Link to="/" className="auth-logo">
          Job<span>Connect</span>
        </Link>

        <div className="auth-heading">

          <h1>Create your account</h1>

          <p>
            Start your journey toward your dream career.
          </p>

        </div>


        {error && (
          <div className="auth-error">
            ⚠️ {error}
          </div>
        )}


        <form onSubmit={handleSubmit}>

          <div className="input-group">

            <label htmlFor="name">
              Full Name
            </label>

            <div className="input-wrapper">

              <span>👤</span>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />

            </div>

          </div>


          <div className="input-group">

            <label htmlFor="email">
              Email Address
            </label>

            <div className="input-wrapper">

              <span>✉</span>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />

            </div>

          </div>


          <div className="input-group">

            <label htmlFor="password">
              Password
            </label>

            <div className="input-wrapper">

              <span>🔒</span>

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "🙈" : "👁"}
              </button>

            </div>

          </div>


          <div className="input-group">

            <label>
              I want to
            </label>

            <div className="role-selection">

              <label
                className={
                  formData.role === "jobseeker"
                    ? "role-card active"
                    : "role-card"
                }
              >

                <input
                  type="radio"
                  name="role"
                  value="jobseeker"
                  checked={formData.role === "jobseeker"}
                  onChange={handleChange}
                />

                <span className="role-icon">
                  💼
                </span>

                <span>
                  <strong>Find a Job</strong>
                  <small>I'm looking for opportunities</small>
                </span>

              </label>


              <label
                className={
                  formData.role === "recruiter"
                    ? "role-card active"
                    : "role-card"
                }
              >

                <input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={formData.role === "recruiter"}
                  onChange={handleChange}
                />

                <span className="role-icon">
                  🏢
                </span>

                <span>
                  <strong>Hire Talent</strong>
                  <small>I'm looking for candidates</small>
                </span>

              </label>

            </div>

          </div>


          <label className="terms">

            <input type="checkbox" required />

            <span>
              I agree to the{" "}
              <a href="#">Terms of Service</a>{" "}
              and{" "}
              <a href="#">Privacy Policy</a>
            </span>

          </label>


          <button
            type="submit"
            className="auth-submit"
          >
            Create Account
            <span>→</span>
          </button>

        </form>


        <p className="auth-switch">

          Already have an account?

          <Link to="/login">
            Sign in
          </Link>

        </p>


        <Link to="/" className="back-home">
          ← Back to JobConnect
        </Link>

      </div>

    </div>
  );
}

export default Register;