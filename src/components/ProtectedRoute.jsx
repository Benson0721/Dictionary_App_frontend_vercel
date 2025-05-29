import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../hooks/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
