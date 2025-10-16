import { AuthBindings } from "@refinedev/core";

const authProvider: AuthBindings = {
  login: async () => {
    window.location.href = "/api/login";
    return {
      success: false,
    };
  },
  register: async () => {
    window.location.href = "/api/register";
    return {
      success: false,
    };
  },
  forgotPassword: async () => {
    window.location.href = "/api/forgot-password";
    return {
      success: false,
    };
  },
  logout: async () => {
    window.location.href = "/api/logout";
    return {
      success: true,
    };
  },
  onError: async (error) => {
    if (error.status === 401) {
      return {
        logout: true,
        redirectTo: "/api/login",
      };
    }

    return { error };
  },
  check: async () => {
    try {
      const response = await fetch("/api/auth/check", {
        credentials: "include",
      });

      if (response.ok) {
        return {
          authenticated: true,
        };
      }

      return {
        authenticated: false,
        redirectTo: "/api/login",
      };
    } catch (err) {
      return {
        authenticated: false,
        redirectTo: "/api/login",
      };
    }
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    try {
      const response = await fetch("/api/auth/user", {
        credentials: "include",
      });

      if (!response.ok) {
        return null;
      }

      const user = await response.json();

      if (user) {
        return {
          id: user.id,
          name: user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}` 
            : user.email || "User",
          email: user.email,
          avatar: user.profileImageUrl,
        };
      }

      return null;
    } catch (err) {
      console.error("Unexpected error in getIdentity:", err);
      return null;
    }
  },
};

export default authProvider;
