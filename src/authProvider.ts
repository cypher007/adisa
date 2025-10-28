
import { AuthBindings } from "@refinedev/core";

const authProvider: AuthBindings = {
  login: async ({ email, password }) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      if (response.ok) {
        return {
          success: true,
          redirectTo: "/",
        };
      }

      return {
        success: false,
        error: {
          name: "LoginError",
          message: "Invalid email or password",
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          name: "LoginError",
          message: "An error occurred during login",
        },
      };
    }
  },
  logout: async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      return {
        success: true,
        redirectTo: "/login",
      };
    } catch (error) {
      return {
        success: false,
        error: {
          name: "LogoutError",
          message: "An error occurred during logout",
        },
      };
    }
  },
  check: async () => {
    try {
      const response = await fetch("/api/me");
      if (response.ok) {
        return {
          authenticated: true,
        };
      }
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    } catch (error) {
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    try {
      const response = await fetch("/api/me");
      if (response.ok) {
        const user = await response.json();
        return user;
      }
      return null;
    } catch (error) {
      return null;
    }
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};

export default authProvider;
