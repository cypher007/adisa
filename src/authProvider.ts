
import { AuthBindings } from "@refinedev/core";
import { supabaseClient } from "./utility";

const authProvider: AuthBindings = {
  login: async ({ email, password }) => {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: {
            message: error.message,
            name: "Login Error",
          },
        };
      }

      if (data?.user) {
        return {
          success: true,
          redirectTo: "/",
        };
      }

      return {
        success: false,
        error: {
          message: "Login failed",
          name: "Invalid email or password",
        },
      };
    } catch (err) {
      return {
        success: false,
        error: {
          message: "An unexpected error occurred",
          name: "Login Error",
        },
      };
    }
  },
  logout: async () => {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  onError: async (error) => {
    if (error.status === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
  check: async () => {
    try {
      const { data, error } = await supabaseClient.auth.getSession();

      if (error) {
        return {
          authenticated: false,
          error: {
            message: "Session check failed",
            name: error.message,
          },
          logout: true,
          redirectTo: "/login",
        };
      }

      const { session } = data;

      if (session) {
        return {
          authenticated: true,
        };
      }

      return {
        authenticated: false,
        error: {
          message: "Not authenticated",
          name: "No active session",
        },
        logout: true,
        redirectTo: "/login",
      };
    } catch (err) {
      return {
        authenticated: false,
        error: {
          message: "Authentication check failed",
          name: "Unexpected error",
        },
        logout: true,
        redirectTo: "/login",
      };
    }
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    try {
      const { data, error } = await supabaseClient.auth.getUser();
      
      if (error) {
        console.error("Error fetching user identity:", error);
        return null;
      }

      const { user } = data;

      if (user) {
        return {
          id: user.id,
          name: user.email || "User",
          email: user.email,
          avatar: user.user_metadata?.avatar_url,
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
