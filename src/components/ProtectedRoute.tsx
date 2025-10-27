import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const session = localStorage.getItem("ticketapp_session");

  if (!session) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}
