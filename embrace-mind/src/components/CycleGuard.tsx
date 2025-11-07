import { Navigate } from "react-router-dom";
import { useAuth } from "@/store/useAuth";

export default function CycleGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (user?.gender !== "female") {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <>{children}</>;
}
