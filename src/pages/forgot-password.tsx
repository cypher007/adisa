import { useEffect } from "react";

export const ForgotPasswordPage = () => {
  useEffect(() => {
    window.location.href = "/api/forgot-password";
  }, []);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      fontSize: "18px"
    }}>
      Redirecting to password reset...
    </div>
  );
};
