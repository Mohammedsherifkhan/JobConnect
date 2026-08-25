import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Temporary admin credentials
    // We will move this to the backend later.
    const ADMIN_EMAIL = "admin@jobconnect.com";
    const ADMIN_PASSWORD = "admin123";

    if (
      email === ADMIN_EMAIL &&
      password === ADMIN_PASSWORD
    ) {
      const adminUser = {
        id: "admin-001",
        name: "JobConnect Admin",
        email: ADMIN_EMAIL,
        role: "admin",
      };

      localStorage.setItem(
        "jobconnect_current_user",
        JSON.stringify(adminUser)
      );

      alert("Admin login successful!");

      navigate("/admin-dashboard");
    } else {
      alert("Invalid admin email or password.");
    }
  };

  return (
    <div className="login-page">

      <div className="login-container">

        <div className="login-header">
          <span>ADMIN PORTAL</span>

          <h1>
            Admin Login
          </h1>

          <p>
            Login to manage JobConnect.
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          <div className="form-group">

            <label>
              Admin Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="admin@jobconnect.com"
              required
            />

          </div>

          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter admin password"
              required
            />

          </div>

          <button
            type="submit"
            className="login-btn"
          >
            Login as Admin →
          </button>

        </form>

      </div>

    </div>
  );
}

export default AdminLogin;