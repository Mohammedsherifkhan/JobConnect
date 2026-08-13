import { useState } from "react";
import { Link } from "react-router-dom";
import "../Auth.css";

function ForgotPassword() {

  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email) {
      alert("Please enter your email.");
      return;
    }

    alert("Password reset UI working!");
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <Link to="/" className="auth-logo">
          Job<span>Connect</span>
        </Link>

        <div className="auth-heading">

          <h1>Forgot password?</h1>

          <p>
            Enter your email and we'll help you reset
            your password.
          </p>

        </div>


        <form onSubmit={handleSubmit}>

          <div className="input-group">

            <label>Email Address</label>

            <div className="input-wrapper">

              <span>✉</span>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
              />

            </div>

          </div>


          <button
            type="submit"
            className="auth-submit"
          >
            Send Reset Link
            <span>→</span>
          </button>

        </form>


        <p className="auth-switch">

          Remember your password?

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

export default ForgotPassword;