
import { AuthBindings } from "@refinedev/core";
import { supabaseClient } from "./utility";

const authProvider: AuthBindings = {
  login: async ({ email, password }) => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error,
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
    const { data } = await supabaseClient.auth.getUser();
    const { user } = data;

    if (user) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      error: {
        message: "Check failed",
        name: "Token not found",
      },
      logout: true,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const { data } = await supabaseClient.auth.getUser();
    const { user } = data;

    if (user) {
      return {
        ...user,
        name: user.email,
      };
    }

    return null;
  },
};

export default authProvider;
