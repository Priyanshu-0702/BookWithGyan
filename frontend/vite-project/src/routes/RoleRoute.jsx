import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function RoleRoute({ role, children }) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;

  if (user.role?.toUpperCase() !== role.toUpperCase()) {
    return <Navigate to="/login" />;
  }

  return children;
}