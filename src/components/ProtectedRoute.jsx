import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, requiredType }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="text-center mt-10">Cargando...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredType && user.type !== requiredType) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
