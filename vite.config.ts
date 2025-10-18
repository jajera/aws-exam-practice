import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/aws-exam-practice/",
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  publicDir: "public",
});
