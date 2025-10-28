import { AuthBindings } from "@refinedev/core";

const authProvider: AuthBindings = {
  login: async ({ username, password }) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.requires2FA) {
          return {
            success: false,
            error: {
              name: "2FARequired",
              message: "Redirection vers vérification 2FA",
            },
            redirectTo: "/verify-2fa",
          };
        }

        return {
          success: true,
          redirectTo: "/dashboard",
        };
      }

      return {
        success: false,
        error: {
          name: "LoginError",
          message: data.message || "Identifiants invalides",
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          name: "LoginError",
          message: "Une erreur est survenue lors de la connexion",
        },
      };
    }
  },

  logout: async () => {
    try {
      await fetch("/api/logout", {
        credentials: "include",
      });

      return {
        success: true,
        redirectTo: "/login",
      };
    } catch (error) {
      return {
        success: false,
        error: {
          name: "LogoutError",
          message: "Une erreur est survenue lors de la déconnexion",
        },
      };
    }
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
        redirectTo: "/login",
      };
    } catch (error) {
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }
  },

  getPermissions: async () => {
    try {
      const response = await fetch("/api/auth/user", {
        credentials: "include",
      });

      if (response.ok) {
        const user = await response.json();
        return user.role;
      }

      return null;
    } catch (error) {
      return null;
    }
  },

  getIdentity: async () => {
    try {
      const response = await fetch("/api/auth/user", {
        credentials: "include",
      });

      if (response.ok) {
        const user = await response.json();
        return {
          id: user.id,
          name: user.username,
          email: user.email,
          avatar: user.profileImageUrl,
        };
      }

      return null;
    } catch (error) {
      return null;
    }
  },

  onError: async (error) => {
    if (error?.statusCode === 401) {
      return {
        logout: true,
        redirectTo: "/login",
      };
    }

    return { error };
  },
};

export default authProvider;
