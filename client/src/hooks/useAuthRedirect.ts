// src/hooks/useAuthRedirect.ts
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// Hook to redirect user to '/' if already logged in
export function useAuthRedirect() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      // If user exists and not loading, redirect to home
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);
}
