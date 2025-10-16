import { useEffect } from "react";

export const LoginPage = () => {
  useEffect(() => {
    window.location.href = "/api/login";
  }, []);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      fontSize: "18px"
    }}>
      Redirecting to login...
    </div>
  );
};
