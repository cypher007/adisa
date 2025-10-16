import { useEffect } from "react";

export const RegisterPage = () => {
  useEffect(() => {
    window.location.href = "/api/register";
  }, []);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      fontSize: "18px"
    }}>
      Redirecting to registration...
    </div>
  );
};
