import { createClient } from "@refinedev/supabase";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error(
    "Missing Supabase credentials. Please add VITE_SUPABASE_URL and VITE_SUPABASE_KEY to your environment variables."
  );
}

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
  db: {
    schema: "public",
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
