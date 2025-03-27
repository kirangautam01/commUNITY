import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./globalContext/AuthContext.jsx";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return (<p>Loading...</p>); // Show a loader while checking auth

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
