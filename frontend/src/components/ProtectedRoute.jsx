import { Navigate, Outlet, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ adminOnly = false }) => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Prevent going back to dashboard after admin logs in
  if (isAdmin && location.pathname === "/dashboard") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return <Outlet />;
};

ProtectedRoute.propTypes = {
  adminOnly: PropTypes.bool,
};

export default ProtectedRoute;
