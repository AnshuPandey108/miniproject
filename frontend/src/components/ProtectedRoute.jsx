import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const accessToken = useSelector((s) => s.auth.accessToken);
  return accessToken ? children : <Navigate to="/login" replace />;
}
