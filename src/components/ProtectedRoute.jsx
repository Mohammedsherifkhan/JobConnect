import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const savedUser = localStorage.getItem(
    "jobconnect_current_user"
  );

  /* User not logged in */

  if (!savedUser) {
    if (role === "admin") {
      return (
        <Navigate
          to="/admin-login"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  let user;

  /* Validate stored user */

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
        to={
          role === "admin"
            ? "/admin-login"
            : "/login"
        }
        replace
      />
    );
  }

  /* Check role */

  if (role && user.role !== role) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;