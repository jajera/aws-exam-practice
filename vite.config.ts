import react from "@vitejs/plugin-react";
import { copyFileSync, mkdirSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { defineConfig } from "vite";

// Plugin to copy data directory to dist
const copyDataPlugin = () => {
  return {
    name: "copy-data",
    writeBundle() {
      const srcDir = "data";
      const destDir = "dist/data";

      try {
        mkdirSync(destDir, { recursive: true });

        const files = readdirSync(srcDir);
        files.forEach((file) => {
          const srcPath = join(srcDir, file);
          const destPath = join(destDir, file);

          if (statSync(srcPath).isFile()) {
            copyFileSync(srcPath, destPath);
            console.log(`Copied ${srcPath} to ${destPath}`);
          }
        });
      } catch (error) {
        console.error("Error copying data directory:", error);
      }
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyDataPlugin()],
  base: "/aws-exam-practice/",
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  publicDir: "public",
});
