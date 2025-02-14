import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import AuthModal from "@/components/auth/AuthModal";

export default function SignupPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const redirectTo = sessionStorage.getItem("redirectTo") || "/";
      sessionStorage.removeItem("redirectTo");
      navigate(redirectTo);
    }
  }, [user, navigate]);

  const handleClose = () => {
    navigate("/");
  };

  return <AuthModal isOpen={true} onClose={handleClose} defaultTab="signup" />;
}
