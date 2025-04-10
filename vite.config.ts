import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { env } from "process";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [(env.REPLIT_DOMAINS || "").split(",")[0]],
  }
});
