import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  optimizeDeps: {
    // The standalone landing page in public/laocoon pulls Three.js from a CDN
    // importmap. Without this, the dep scanner treats its bare imports as
    // missing project dependencies and errors on boot.
    entries: ["index.html", "src/**/*.{js,jsx}"]
  }
});
