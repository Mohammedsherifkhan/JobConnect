import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  // Get logged-in user
  const savedUser = localStorage.getItem(
    "jobconnect_current_user"
  );

  // User is not logged in
  if (!savedUser) {
    // Admin goes to Admin Login
    if (role === "admin") {
      return (
        <Navigate
          to="/admin-login"
          replace
        />
      );
    }

    // Candidate / Recruiter goes to normal Login
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  let user;

  // Convert saved user data
  try {
    user = JSON.parse(savedUser);
  } catch (error) {
    console.error(
      "Invalid user data:",
      error
    );

    localStorage.removeItem(
      "jobconnect_current_user"
    );

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // Check required role
  if (role && user.role !== role) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  // Everything is correct
  return children;
}

export default ProtectedRoute;