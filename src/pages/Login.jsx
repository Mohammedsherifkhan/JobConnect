import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    alert("Login UI working successfully!");

    navigate("/");
  };

  return (
    <div className="auth-page">

      <div className="auth-background-circle circle-one"></div>
      <div className="auth-background-circle circle-two"></div>

      <div className="auth-card">

        <Link to="/" className="auth-logo">
          Job<span>Connect</span>
        </Link>

        <div className="auth-heading">
          <h1>Welcome back 👋</h1>

          <p>
            Sign in to continue your career journey.
          </p>
        </div>

        {error && (
          <div className="auth-error">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

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
                placeholder="Enter your password"
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


          <div className="auth-options">

            <label className="remember">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            <Link to="/forgot-password">
              Forgot password?
            </Link>

          </div>


          <button
            type="submit"
            className="auth-submit"
          >
            Sign In
            <span>→</span>
          </button>

        </form>


        <div className="auth-divider">
          <span>OR</span>
        </div>


        <div className="social-login">

          <button type="button">
            <span>G</span>
            Continue with Google
          </button>

          <button type="button">
            <span>in</span>
            Continue with LinkedIn
          </button>

        </div>


        <p className="auth-switch">

          Don't have an account?

          <Link to="/register">
            Create one
          </Link>

        </p>


        <Link to="/" className="back-home">
          ← Back to JobConnect
        </Link>

      </div>

    </div>
  );
}

export default Login;