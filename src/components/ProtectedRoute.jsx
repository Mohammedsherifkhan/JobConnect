import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const savedUser = localStorage.getItem(
    "jobconnect_current_user"
  );

  // Not logged in
  if (!savedUser) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(savedUser);

  // Wrong role
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;